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
import PhoneInput from 'react-phone-number-input';
import { sendSMS, authSMS } from '../utils/api';
import 'react-phone-number-input/style.css';

const LENGTH_OF_SMS_CODE = 4;
function SigninSMS() {
  const navigate = useNavigate();
  const [smsCode, setSmsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [btnLabel, setBtnLabel] = useState('SEND');

  const handleSubmit = (event) => {
    event.preventDefault();
    authSMS(smsCode).then((r) => {
      if (r.data.success) {
        localStorage.setItem('token', r.data.token);
        localStorage.setItem('loggedin', true);
        navigate('/dashboard/app');
      } else {
        setShowError(true);
      }
    });
  };

  const sendMessage = () => {
    let count = 30;
    setLoading(true);
    setShowError(false);
    sendSMS(phoneNumber.substring(1)).then((r) => console.log(r));
    const counter = setInterval(() => {
      setBtnLabel(`${count}s`);
      count--;
      if (count === -1) {
        clearInterval(counter);
        setBtnLabel('SEND');
        setLoading(false);
      }
    }, 1000);
  };

  const handleSMSCodeChande = (val) => {
    val = val.slice(0, 4);
    setSmsCode(val);
  };

  return (
    <EntryPage>
      <EntryCard>
        <Box padding="0px 20px">
          <h2 style={{ fontFamily: 'Halyard' }}>2-STEP VERIFICATION</h2>
          <div style={{ display: 'flex', marginTop: '50px' }}>
            <PhoneInput
              defaultCountry="US"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
            <Button
              type="text"
              style={{ marginLeft: '10px', height: 'auto', flex: '1' }}
              onClick={sendMessage}
              disabled={!phoneNumber || loading}>
              {btnLabel}
            </Button>
          </div>
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
            {showError && (
              <p style={{ marginBottom: '10px', color: 'red' }}>Invalid code please try again</p>
            )}
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
export default SigninSMS;
