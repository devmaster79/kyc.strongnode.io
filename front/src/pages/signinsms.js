import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Box } from '@material-ui/system';
import { EntryPage } from './style';
import Button from '../components/Button';
import EntryCard from '../components/EntryCard';
import Input from '../components/Input';
import InputGroup from '../components/InputGroup';
import { ReactComponent as LockIcon } from '../icons/lock.svg';
import { sendSMS, authSMS } from '../utils/api';

const LENGTH_OF_SMS_CODE = 4;
function SigninSMS() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(null);
  const [sendState, setSendState] = useState("loading");
  const [smsCode, setSmsCode] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setAuthState('loading');
    authSMS(smsCode).then((r) => {
      if (r.data.result === 'success') {
        localStorage.setItem('token', r.data.token);
        localStorage.setItem('loggedin', true);
        navigate('/dashboard/app');
      } else {
        setAuthState(r.data.result)
      }
    }).catch((_error) => {
      setAuthState('unexpected-error')
    });
  };

  useEffect(() => {
    // start sending SMS as soon as the page loads
    sendSMS()
      .then((r) => { setSendState(r.data.result) })
      .catch((_error) => {
        setSendState('unexpected-error')
      })
  }, []);

  const handleSMSCodeChande = (val) => {
    val = val.slice(0, 4);
    setSmsCode(val);
  };

  return (
    <EntryPage>
      <EntryCard>
        <Box padding="0px 20px">
          <h2 style={{ fontFamily: 'Halyard' }}>2-STEP VERIFICATION</h2>
          <SendMsg>
            {sendState === "loading" && "Sending the SMS..."}
            {sendState === "success" && "We've sent you an SMS to your given phone number."}
            {/* TODO: sendState === "retry-error" && <Error>We've sent you an SMS already. Please wait.</Error> */}
            {sendState === "unexpected-error" && <Error>We couldn't send you an SMS. Please try again later.</Error>}
          </SendMsg>
          <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
            <InputGroup>
              <LockIcon />
              <SBInput
                type="number"
                placeholder="Enter your SMS code"
                id="smsConfirm"
                value={smsCode}
                style={{ padding: '16px 20px 16px 40px' }}
                onChange={(e) => handleSMSCodeChande(e.target.value)}
              />
            </InputGroup>
            <AuthMsg>
              {authState === "loading" && "Validating..."}
              {authState === "invalid-code-error" && <Error>Invalid code please try again.</Error>}
              {authState === "unexpected-error" && <Error>Some error occurred during the authorization. Please try again later.</Error>}
            </AuthMsg>
            <Button
              type="submit"
              full
              disabled={smsCode.length < LENGTH_OF_SMS_CODE}
            >
              CONFIRM
            </Button>
          </form>
        </Box>
      </EntryCard>
    </EntryPage>
  );
}

const SBInput = styled(Input)`
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-size: 18px;
  }
`;
const SendMsg = styled(div)`
  display: flex;
  margin-top: 50px;
`;
const AuthMsg = styled(div)`
  margin-bottom: 10px;
`;
const Error = styled(span)`
  color: red;
`;

export default SigninSMS;