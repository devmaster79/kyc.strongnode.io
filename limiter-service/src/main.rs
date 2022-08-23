use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

use commands::Response;
use dotenv::dotenv;

use utils::now;
use ws::util::{Timeout, Token};
use ws::{self, listen, CloseCode, Error, ErrorKind, Frame, Handler, Handshake, Message, Sender};

const CLEANUP_THREAD_TICK_MS: u64 = 5_000;
const CLEANUP_THREAD_CLEAN_FREQUENCY_TICK: u64 = 60 * 60 * 1000 / CLEANUP_THREAD_TICK_MS; // hourly
const PING: Token = Token(1);
const EXPIRE: Token = Token(2);

use crate::commands::Command;
use crate::limiter::AccessResult;

mod commands;
mod limiter;
mod limits;
mod utils;

fn main() {
    env_logger::init();
    dotenv().ok();

    // the configured limiters
    let limits = limits::Limits::new();
    // every thread should stop
    let is_closing = Arc::new(Mutex::new(false));

    // cleanup thread
    let is_closing_clone = is_closing.clone();
    let limits_clone = limits.clone();
    let cleanup_thread = std::thread::spawn(move || {
        let mut counter = 0;
        while is_closing_clone
            .lock()
            .expect("Couldn't lock mutext")
            .clone()
            == false
        {
            thread::sleep(Duration::from_millis(CLEANUP_THREAD_TICK_MS));
            counter += 1;
            if counter == CLEANUP_THREAD_CLEAN_FREQUENCY_TICK {
                limits_clone.clean_obsoletes();
                counter = 0;
            }
        }
    });

    // websocket thread
    let websocket_thread = std::thread::spawn(move || {
        listen(
            std::env::var("LIMITER_BINDS").expect("missing env var: LIMITER_BINDS"),
            |out| Server {
                out,
                ping_timeout: None,
                expire_timeout: None,
                limits: limits.clone(),
            },
        )
        .expect("Failed to create WebSocket.");
    });

    websocket_thread
        .join()
        .expect("Couldn't join websocket thread");
    *is_closing.lock().unwrap() = true;
    cleanup_thread.join().expect("Couldn't join cleanup thread");
}

struct Server {
    out: Sender,
    ping_timeout: Option<Timeout>,
    expire_timeout: Option<Timeout>,
    limits: limits::Limits,
}

impl Handler for Server {
    fn on_open(&mut self, _: Handshake) -> ws::Result<()> {
        // schedule a timeout to send a ping every 5 seconds
        self.out.timeout(5_000, PING)?;
        // schedule a timeout to close the connection if there is no activity for 30 seconds
        self.out.timeout(30_000, EXPIRE)
    }

    fn on_message(&mut self, msg: Message) -> ws::Result<()> {
        let command: Result<Command, _> = msg.as_text()?.try_into();
        self.out.send(match command {
            Ok(Command::Access {
                limiter_id,
                user_id,
            }) => handle_access(&self.limits, limiter_id, user_id),
            Ok(Command::Resolve {
                limiter_id,
                user_id,
            }) => handle_resolve(&self.limits, limiter_id, user_id),
            Err(commands::ParseError::WrongCommand) => {
                println!("Found a wrong command: {}", msg);
                Response::ErrorWrongCommand
            }
        })
    }

    fn on_error(&mut self, err: Error) {
        println!("Got an error: {}", err);
    }

    fn on_timeout(&mut self, event: Token) -> ws::Result<()> {
        match event {
            // PING timeout has occured, send a ping and reschedule
            PING => {
                self.out.ping(now().as_nanos().to_string().into())?;
                self.ping_timeout.take();
                self.out.timeout(5_000, PING)
            }
            // EXPIRE timeout has occured, this means that the connection is inactive, let's close
            EXPIRE => self.out.close(CloseCode::Away),
            // No other timeouts are possible
            _ => Err(Error::new(
                ErrorKind::Internal,
                "Invalid timeout token encountered!",
            )),
        }
    }

    fn on_new_timeout(&mut self, event: Token, timeout: Timeout) -> ws::Result<()> {
        // Cancel the old timeout and replace.
        if event == EXPIRE {
            if let Some(t) = self.expire_timeout.take() {
                self.out.cancel(t)?
            }
            self.expire_timeout = Some(timeout)
        } else {
            if let Some(t) = self.ping_timeout.take() {
                self.out.cancel(t)?
            }
            self.ping_timeout = Some(timeout)
        }

        Ok(())
    }

    fn on_close(&mut self, code: CloseCode, reason: &str) {
        if let Some(t) = self.expire_timeout.take() {
            if let Err(err) = self.out.cancel(t) {
                println!("Couldn't clear timout {}", err);
            }
        }
        if let Some(t) = self.ping_timeout.take() {
            if let Err(err) = self.out.cancel(t) {
                println!("Couldn't clear timout {}", err);
            }
        }
        DefaultHandler.on_close(code, reason);
    }

    fn on_frame(&mut self, frame: Frame) -> ws::Result<Option<Frame>> {
        // Some activity has occured, so reset the expiration
        self.out.timeout(30_000, EXPIRE)?;

        // Run default frame validation
        DefaultHandler.on_frame(frame)
    }
}

fn handle_resolve(limits: &limits::Limits, limiter_id: String, user_id: String) -> Response {
    if let Some(limiter) = limits.get_limiter(&limiter_id) {
        limiter.resolve(user_id);
        Response::ResolveDone
    } else {
        Response::ErrorLimiterNotFound
    }
}

fn handle_access(limits: &limits::Limits, limiter_id: String, user_id: String) -> Response {
    if let Some(limiter) = limits.get_limiter(&limiter_id) {
        match limiter.access(user_id) {
            AccessResult::ALLOWED => Response::AccessAllowed,
            AccessResult::DENIED { next_free_time } => Response::AccessDenied(next_free_time),
        }
    } else {
        Response::ErrorLimiterNotFound
    }
}

// For accessing the default handler implementation
struct DefaultHandler;

impl Handler for DefaultHandler {}
