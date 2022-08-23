use ws::Message;

pub enum Command {
    Access { limiter_id: String, user_id: String },
    Resolve { limiter_id: String, user_id: String },
}

pub enum Response {
    AccessAllowed,
    AccessDenied(u128),
    ResolveDone,
    ErrorLimiterNotFound,
    ErrorWrongCommand,
}

pub enum ParseError {
    WrongCommand,
}

impl TryFrom<&str> for Command {
    type Error = ParseError;

    fn try_from(value: &str) -> Result<Self, ParseError> {
        let mut sections = value.split(' ');
        let command = sections.next().ok_or(ParseError::WrongCommand)?;
        let limiter_id = sections.next().ok_or(ParseError::WrongCommand)?.into();
        let user_id = sections.next().ok_or(ParseError::WrongCommand)?.into();
        match command {
            "ACCESS" => Ok(Command::Access {
                limiter_id,
                user_id,
            }),
            "RESOLVE" => Ok(Command::Resolve {
                limiter_id,
                user_id,
            }),
            _ => Err(ParseError::WrongCommand),
        }
    }
}

impl Response {
    pub fn msg(&self) -> String {
        match self {
            Response::AccessAllowed => "ALLOWED".into(),
            Response::AccessDenied(next_timestamp) => format!("DENIED {}", next_timestamp),
            Response::ResolveDone => "DONE".into(),
            Response::ErrorLimiterNotFound => "ERROR unknown limiter id".into(),
            Response::ErrorWrongCommand => "ERROR wrong command".into(),
        }
    }
}

impl Into<Message> for Response {
    fn into(self) -> Message {
        self.msg().into()
    }
}
