import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EntryPage } from "./style";
import EntryCard from "../components/EntryCard";
import InputGroup from "../components/InputGroup";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navar";
import { ReactComponent as TelegramIcon } from "../icons/telegram.svg";
import { ReactComponent as TwitterIcon } from "../icons/twitter.svg";
import { createProfile } from "../utils/api";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #f3f3f5;
`;

const ProgressBarWrapper = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  jusity-content: flex-start;
  text-align: left;
  p {
    margin-top: 30px;
    font-style: medium;
    font-size: 14px;
    line-height: 18px;
    color: #584a72;
  }
  progress {
    margin-top: 12px;
    width: 100%;
    max-width: 401px;
    height: 10px;
    border: 1px solid transparent;
    border-radius: 6px;
    &[value]::-webkit-progress-bar {
      background-color: #eee;
      border-radius: 2px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
    }
  }
`;

const InputWrapper = styled.div`
  text-align: left;
  p {
    margin-bottom: 12px;
  }
`;

function Profile() {
  const navigate = useNavigate();

  const [telegramUserName, setTelegramUserName] = useState("");
  const [twitterUserName, setTwitterUserName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const handleCreateProfile = useCallback(async (data) => {
    try {
      const res = await createProfile(data);
      if (res.data) {
        navigate("/private-sale-interest-form");
      }
    } catch (err) {
      console.log("Error for create password", err);
    }
  }, []);

  const handleTGUserNameInputChange = (event) => {
    setTelegramUserName(event.target.value);
  };

  const handleTwitterUserNameInputChange = (event) => {
    setTwitterUserName(event.target.value);
  };

  const handleWalletAddressInputChange = (event) => {
    setWalletAddress(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      telegram_id: telegramUserName,
      twitter_id: twitterUserName,
      wallet_address: walletAddress,
    };
    handleCreateProfile(data);
  };

  return (
    <Container>
      <Navbar />
      <EntryCard>
        <h2>Profile</h2>
        <ProgressBarWrapper>
          <p>10/100% Complete</p>
          <progress value="10" max="100" />
        </ProgressBarWrapper>
        <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
          <InputWrapper>
            <p>Telegram</p>
            <InputGroup>
              <TelegramIcon />
              <Input
                type="text"
                placeholder="@username"
                id="telegram-username"
                style={{ padding: "16px 20px 16px 40px" }}
                value={telegramUserName}
                onChange={handleTGUserNameInputChange}
              />
            </InputGroup>
          </InputWrapper>

          <InputWrapper>
            <p>Twitter</p>
            <InputGroup>
              <TwitterIcon />
              <Input
                type="text"
                placeholder="@username"
                id="twitter-username"
                style={{ padding: "16px 20px 16px 40px" }}
                value={twitterUserName}
                onChange={handleTwitterUserNameInputChange}
              />
            </InputGroup>
          </InputWrapper>

          <InputWrapper>
            <p>Wallet address</p>
            <InputGroup>
              <Input
                type="text"
                placeholder="Wallet id"
                id="wallet-id"
                value={walletAddress}
                onChange={handleWalletAddressInputChange}
              />
            </InputGroup>
          </InputWrapper>

          <Button type="submit" full>
            NEXT
          </Button>
        </form>
      </EntryCard>
    </Container>
  );
}

export default Profile;
