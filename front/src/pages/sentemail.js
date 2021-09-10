import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EntryPage } from "./style";
import EntryCard from "../components/EntryCard";
import Button from "../components/Button";
import { ReactComponent as CheckIcon } from "../icons/check.svg";

const P = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: #210e43;
  margin-bottom: 20px;
  text-align: center;
`;

function SentEmail() {
  const navigate = useNavigate();

  return (
    <EntryPage>
      <EntryCard emailsent>
        <CheckIcon />
        <h2 style={{ marginTop: 25, marginBottom: 20 }}>Email Sent</h2>
        <P>Please check your mail inbox. We sent you an email.</P>
        <P style={{ paddingLeft: 32, paddingRight: 32 }}>
          Click the magin link and enter your user password to activate your
          create account
        </P>
        <Button full onClick={() => navigate("/create-account-password")}>
          OK
        </Button>
      </EntryCard>
    </EntryPage>
  );
}

export default SentEmail;
