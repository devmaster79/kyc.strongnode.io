import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { EntryPage } from "./style";
import EntryCard from "../components/EntryCard";
import InputGroup from "../components/InputGroup";
import Input from "../components/Input";
import Button from "../components/Button";
import { ReactComponent as UserIcon } from "../icons/user.svg";
import { ReactComponent as LockIcon } from "../icons/lock.svg";
import { verifyEmail, createPassword } from "../utils/api";

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

function CreateAccountPassword() {
  const navigate = useNavigate();

  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    handleVerifyEmail()
  }, [])

  const handleVerifyEmail = useCallback(
    async () => {
      try {
        localStorage.setItem('password_token', location.search.split("=")[1])
        const res = await verifyEmail({
          "password_token": localStorage.getItem("password_token")
        })
        console.log("res???", res);
        setUserName(res.data?.user.user_name)
      } catch (err) {
        console.log("Error for email verification", err);
      }
    },
    [location]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) return;

    const data = {
      "password_token": localStorage.getItem("password_token"),
      "password": password
    }
    handleCreatePassword(data)
  };

  const handleCreatePassword = useCallback(
    async (data) => {
      try {
        const res = await createPassword(data)
        console.log("-- handleCreatePassword --res???", res);
        navigate("/profile");
      } catch (err) {
        console.log("Error for email verification", err);
      }
    },
    []
  );

  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordInputChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  return (
    <EntryPage>
      <EntryCard>
        <h2>Create Account Password</h2>
        <UserInfoWrapper>
          <UserIcon />
          <p>{{ userName }}</p>
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
              value={confirmPassword}
              onChange={handleConfirmPasswordInputChange}
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
