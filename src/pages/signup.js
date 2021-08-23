import React, { useLayoutEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { EntryPage } from "./style";
import EntryCard from "../components/EntryCard";
import InputGroup from "../components/InputGroup";
import Input from "../components/Input";
import Button from "../components/Button";
import Line from "../components/Line";
import { ReactComponent as MailIcon } from "../icons/message.svg";
import { ReactComponent as ProfileIcon } from "../icons/profile.svg";
import { ReactComponent as ErrorIcon } from "../icons/error.svg";

const TermsWrapper = styled.div`
  text-align: left;
  display: flex;
  margin-bottom: 30px;
  & p {
    font-size: 14px;
    margin-top: -2px;
  }
  & input {
    margin: 0 4px -4px 0;
  }
`;

const AlreadyWrapper = styled.p`
  background: white;
  margin: -12px auto 20px;
  color: #584a72;
  font-size: 14px;
  line-height: 24px;
  width: 60%;
`;

const ValidateWrapper = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  margin-top: -10px;
  margin-bottom: 25px;
  flex-direction: row;
  justify-content: flex-start;
  p {
    margin-left: 8px;
  }
`;

function Signup() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [emailValidated, setEmailValidated] = useState(true);
  
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    return setEmailValidated(validateEmail(email));
  }, [email]);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email) {
      history.push("/sent-email");
    } else {
      setEmailValidated(false);
    }
  };

  const handleEmailInputChange = (event) => setEmail(event.target.value);

  return (
    <EntryPage>
      <EntryCard>
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
          <InputGroup>
            <Input type="text" placeholder="First Name" id="first-name" />
          </InputGroup>
          <InputGroup>
            <Input type="text" placeholder="Middle Name" id="middle-name" />
          </InputGroup>
          <InputGroup>
            <Input type="text" placeholder="Last Name" id="last-name" />
          </InputGroup>
          <InputGroup>
            <MailIcon />
            <Input
              type="text"
              placeholder="Email"
              id="email"
              value={email}
              style={{ padding: "16px 20px 16px 40px" }}
              onChange={handleEmailInputChange}
            />
          </InputGroup>
          {!emailValidated && (
            <ValidateWrapper show={{ emailValidated }}>
              <ErrorIcon />
              <p>Please enter a valid email address</p>
            </ValidateWrapper>
          )}
          <InputGroup>
            <ProfileIcon />
            <Input
              type="text"
              placeholder="User Name"
              id="user-name"
              style={{ padding: "16px 20px 16px 40px" }}
            />
          </InputGroup>
          <TermsWrapper>
            <input type="checkbox" />
            <p>
              By continuing, you agree to
              <Link to="/#">Terms of Use Privacy policy</Link>
            </p>
          </TermsWrapper>
          <Button type="submit" full>
            Sign Up
          </Button>
        </form>
        <Line full></Line>
        <Line full />
        <AlreadyWrapper>Already have an account</AlreadyWrapper>
        <Button onClick={() => history.push("/profile")} full white>
          Sign In
        </Button>
      </EntryCard>
    </EntryPage>
  );
}

export default Signup;
