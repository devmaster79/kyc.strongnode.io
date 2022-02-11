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
import { sendSMS, checkSMS } from '../utils/api';
import 'react-phone-number-input/style.css';

function SigninSMS() {
  const navigate = useNavigate();

  const [smscode, setSmscode] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [cdisable, setCdisable] = useState(true);
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [value, setValue] = useState('');
  const [btnLabel, setBtnLabel] = useState('SEND');

  const handleSubmit = (event) => {
    event.preventDefault();
    checkSMS(email).then((r) => {
      // todo, major issue.
      // todo when user enters wrong SMS code, he can just lookup in the network tab to see the sms code from DB. 🙈
      if (smscode === r.data[0].smscode) {
        navigate('/dashboard/app');
      } else {
        setShowError(true);
      }
    });
  };

  const sendMessage = () => {
    let count = 30;
    setDisabled(true);
    setShowError(false);
    sendSMS(value.substring(1), email).then((r) => console.log(r));
    const counter = setInterval(() => {
      setBtnLabel(`${count}s`);
      count--;
      if (count === -1) {
        clearInterval(counter);
        setBtnLabel('SEND');
        setDisabled(false);
      }
    }, 1000);
  };

  const handle2FA = (val) => {
    if (val.length > 4) {
      val = val.slice(0, 4);
      setSmscode(val);
    } else {
      setSmscode(val);
    }

    if (val) setCdisable(false);
    else setCdisable(true);
    setShowError(false);
  };

  useEffect(() => {
    if (value !== '') setDisabled(false);
    if (!value) setDisabled(true);
    const user_email = localStorage.getItem('email');
    setEmail(user_email);
  }, [value]);

  return (
    <EntryPage>
      <EntryCard>
        <Box padding="0px 20px">
          <h2 style={{ fontFamily: 'Halyard' }}>2-STEP VERIFICATION</h2>
          <div style={{ display: 'flex', marginTop: '50px' }}>
            <PhoneInput
              defaultCountry="US"
              placeholder="Enter phone number"
              value={value}
              onChange={setValue}
            />
            <Button
              type="text"
              style={{ marginLeft: '10px', height: 'auto', flex: '1' }}
              onClick={sendMessage}
              disabled={disabled}>
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
                value={smscode}
                style={{ padding: '16px 20px 16px 40px' }}
                onChange={(e) => handle2FA(e.target.value)}
              />
            </InputGroup>
            {showError && (
              <p style={{ marginBottom: '10px', color: 'red' }}>Invalid code please try again</p>
            )}
            <Button type="submit" full disabled={cdisable}>
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
