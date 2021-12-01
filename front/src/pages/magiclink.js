import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { EntryPage } from "./style";
import EntryCard from "../components/EntryCard";
import Button from "../components/Button";
import { ReactComponent as MagicImg } from "../assets/images/magic.svg";

const P = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: #210e43;
  margin-bottom: 20px;
  text-align: center;
  padding-left: 32px;
  padding-right: 32px;
`;

function MagicLink() {
  const navigate = useNavigate();

  return (
    <EntryPage>
      <EntryCard emailsent>
        <MagicImg />
        <h2 style={{ marginTop: 25, marginBottom: 20 }}>Check your email</h2>
        <P>
            We've sent a magic login link. Please check your email to get your login link.
        </P>
        <Button style={{ width: '30%' }} full onClick={() => navigate("/signin")}>
          OK
        </Button>
      </EntryCard>
    </EntryPage>
  );
}

export default MagicLink;