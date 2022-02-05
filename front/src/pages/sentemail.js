import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { EntryPage } from './style';
import EntryCard from '../components/EntryCard';
import Button from '../components/Button';
import { ReactComponent as CheckIcon } from '../icons/check.svg';

const P = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 26px;
  color: #210e43;
  margin-bottom: 20px;
  text-align: center;
  color: white;
`;

function SentEmail() {
  const navigate = useNavigate();

  return (
    <EntryPage>
      <EntryCard emailsent>
        <CheckIcon />
        <h2
          style={{
            fontFamily: 'Halyard',
            marginTop: 25,
            marginBottom: 20,
            fontSize: '34px',
            fontWeight: 'bold'
          }}>
          EMAIL SENT
        </h2>
        <P>Please check your mail inbox. We sent you an email.</P>
        <P style={{ paddingLeft: 32, paddingRight: 32 }}>
          Click the magic link and enter your user password to activate your account.
        </P>
        <Button style={{ width: '180px' }} onClick={() => navigate('/')}>
          OK
        </Button>
      </EntryCard>
    </EntryPage>
  );
}

export default SentEmail;
