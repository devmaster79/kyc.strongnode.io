import React, { FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EntryPage } from "../style";
import Button from "../../components/Button";
import EntryCard from "../../components/EntryCard";
import Input from "../../components/Input";
import InputGroup from "../../components/InputGroup";
import { ReactComponent as LockIcon } from "../../icons/lock.svg";
import { ReactComponent as MailIcon } from "../../icons/message.svg";
import * as authService from "services/auth";
import { OtherOptions } from "../../components/OtherOptions";
import { useService } from "hooks/useService";

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #4d79f6;
  margin-top: 30px;
  p {
    font-style: normal;
    font-size: 16px;
    line-height: 22px;
    color: #4d79f6;
    margin: 0 0 0 10px;
  }
`;

export function SignInWithPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { data: authState, call: authByPassword } = useService(
    authService.authByPassword
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const state = await authByPassword(password);
    if (state.result === "success") {
      navigate("/sign-in-with-token");
    }
  };

  let message;
  switch (authState.result) {
    case "loading":
      message = "Verifying the password...";
      break;
    case "validation-error":
      message = <Error>Wrong password. Please try agian.</Error>;
      break;
    case "unexpected-error":
      message = <Error>Something went wrong. Please try again later.</Error>;
      break;
    case "unauthorized-error":
      message = <Error>You do not have access to this feature.</Error>;
      break;
    case "banned":
      message = (
        <Error>
          Too many trials. You can try it again{" "}
          {Math.floor(authState.remainingTimeMs / 1000)} seconds later.
        </Error>
      );
      break;
    default:
      break;
  }

  return (
    <EntryPage>
      <EntryCard>
        <h2>Welcome</h2>
        <UserInfoWrapper>
          <MailIcon />
          <p>{localStorage.get("email")}</p>
        </UserInfoWrapper>
        <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
          <InputGroup>
            <LockIcon />
            <Input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              style={{ padding: "16px 20px 16px 40px" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </InputGroup>
          <AuthMsg>{message}</AuthMsg>
          <Button type="submit" full>
            Confirm
          </Button>
          <OtherOptions hidePassword />
        </form>
      </EntryCard>
    </EntryPage>
  );
}

const AuthMsg = styled.div``;
const Error = styled.span`
  color: red;
`;
