import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { EntryPage } from "./style";
import EntryCard from "../components/EntryCard";
import InputGroup from "../components/InputGroup";
import Input from "../components/Input";
import Button from "../components/Button";
import { ReactComponent as UserIcon } from "../icons/user.svg";
import { ReactComponent as LockIcon } from "../icons/lock.svg";


const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #4D79F6;
  margin-top: 30px;
  p {
    font-style: normal;
    font-size: 16px;
    line-height: 22px;
    color: #4D79F6;
    margin: 0 0 0 10px;
  }
`;

function CreateAccountPassword() {
  const history = useHistory();

  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    history.push("/profile");
  };

  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <EntryPage>
      <EntryCard>
        <h2>Create Account Password</h2>
        <UserInfoWrapper>
          <UserIcon />
          <p>Williamson856</p>
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

          <InputGroup>
            <LockIcon />
            <Input
              type="password"
              placeholder="Confirm password"
              id="confirm-password"
              style={{ padding: "16px 20px 16px 40px" }}
            />
          </InputGroup>
          
          <Button type="submit" full>
            Confirm / Sign In
          </Button>
        </form>
      </EntryCard>
    </EntryPage>
  );
}

export default CreateAccountPassword;
