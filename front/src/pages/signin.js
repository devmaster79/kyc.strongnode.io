import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { EntryPage } from "./style";
import EntryCard from "../components/EntryCard";
import InputGroup from "../components/InputGroup";
import Input from "../components/Input";
import Button from "../components/Button";
import { ReactComponent as MailIcon } from "../icons/message.svg";
import { ReactComponent as LockIcon } from "../icons/lock.svg";

function Signin() {
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
        <h2>Log in with Account</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
          <InputGroup>
            <MailIcon />
            <Input
              type="email"
              placeholder="Email"
              id="email"
              value={password}
              style={{ padding: "16px 20px 16px 40px" }}
              onChange={handlePasswordInputChange}
            />
          </InputGroup>

          <InputGroup>
            <LockIcon />
            <Input
              type="password"
              placeholder="Password"
              id="password"
              style={{ padding: "16px 20px 16px 40px" }}
            />
          </InputGroup>

          <Button type="submit" full>
            Sign In
          </Button>
        </form>
      </EntryCard>
    </EntryPage>
  );
}

export default Signin;
