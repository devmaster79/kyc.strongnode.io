# Limiter service

A simple websocket server that can track the past trials and allow / deny access based on this info. The log is stored in memory, to not be the limit feature an overhead. This has to be a standalone service, because the backend has multiple instances, and they not share memory.

Why not Redis?
Redis is too complicated to use compared to this, it lacks features that are very easy to implement in Rust. And this service is small, more efficient and specialized for this particular task.

## Installation

1. You need rust.
2. cp and edit .env.sample to .env
3. `cargo run` or `cargo run --release` or `cargo build --release; ./target/release/limiter-service`

DO NOT EXPOSE THE PORT. This should be a PRIVATE service. Otherwise everybody could rewrite their trial history.

## Usage

You can chat with the service using this command `rlwrap websocat ws://127.0.0.1:3012`. (ip/port might be different)

**ACCESS {limiter_id} {user_id}**
Log the trial and decides whether it is allowed ot not.

    Arguments:
    - limiter_id: string without spaces
    - user_id: string without spaces

    Responses:
    - ALLOWED
    - DENIED {next_free_time}
        next_free_time: timestamp in milliseconds
    - ERROR {message}
        message: string with spaces

    Example:
    << ACCESS smsSend foo@bar.hu
    >> ALLOWED
    << ACCESS smsSend foo@bar.hu
    >> ALLOWED
    << ACCESS smsSend foo@bar.hu
    >> DENIED 1660703522417

**RESOLVE {limiter_id} {user_id}**
Clear the limit/log for the user.

    Arguments:
     - limiter_id: string without spaces
     - user_id: string without spaces

    Responses:
    - DONE
    - ERROR {message}
            message: string with spaces

    Example:
    << RESOLVE smsSend foo@bar.hu
    >> DONE

## How to add limits?

Limits are not runtime configurable. You have to edit the src/limits.rs, then recompile.
