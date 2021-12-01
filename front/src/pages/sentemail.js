import React from "react";
import { useNavigate } from "react-router-dom";
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
        <h2 style={{ marginTop: 25, marginBottom: 20 }}>We Sent You Email</h2>
        <P>Please check your inbox (or your spam/junk folder). We sent you a login link.</P>
        <P style={{ paddingLeft: 32, paddingRight: 32 }}>
          Click the link and enter your password to activate your account. You will notice that your username is already pre-filled.
        </P>
        <Button full onClick={() => navigate("/")}>
          OK
        </Button>
      </EntryCard>
    </EntryPage>
  );
}

export default SentEmail;
