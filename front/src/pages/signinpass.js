import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { EntryPage } from "./style";
import Button from "../components/Button";
import EntryCard from "../components/EntryCard";
import Input from "../components/Input";
import InputGroup from "../components/InputGroup";
import { ReactComponent as LockIcon } from "../icons/lock.svg";
import { ReactComponent as MailIcon } from "../icons/message.svg";

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

function SigninPass() {
  const history = useHistory();

  const [password, setPassword] = useState("");

  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    history.push("/signinsms");
  };

  return (
    <EntryPage>
      <EntryCard>
        <h2>Welcome</h2>
        <UserInfoWrapper>
          <MailIcon />
          <p>teamp@mail.com</p>
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
              onChange={handlePasswordInputChange}
            />
          </InputGroup>
          <Button type="submit" full>
            Confirm
          </Button>
        </form>
      </EntryCard>
    </EntryPage>
  );
}

export default SigninPass;
