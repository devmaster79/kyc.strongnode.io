import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntryPage } from './style';
import Button from '../components/Button';
import EntryCard from '../components/EntryCard';
import Input from '../components/Input';
import InputGroup from '../components/InputGroup';
import { createQR, verifyTOTP } from '../utils/api';
import useLocalStorage from 'hooks/useLocalStorage';

function SigninTwoStep() {
  const navigate = useNavigate();
  const [totp, setTOTP] = useState('');
  const [error, setError] = useState();
  const [qrURL, setQRURL] = useState('');
  const [email, _] = useLocalStorage('email');

  const handleSubmit = (event) => {
    event.preventDefault();
    verifyTOTP(email, totp).then((r) => {
      if (r.data.verified) {
        localStorage.setItem('token', r.data.token);
        if (r.data.enable_sms === true) {
          navigate('/signinsms');
        } else {
          navigate('/dashboard/app');
        }
      } else {
        setError("Invalid code please try again");
      }
    });
  };

  const handleTOTPInputChange = (event) => {
    if (event.target.value.length > 6) {
      event.target.value = event.target.value.slice(0, 6);
      setTOTP(event.target.value);
    } else {
      setTOTP(event.target.value);
    }
  };

  useEffect(() => {
    createQR(email).then((rq) => {
      setQRURL(rq.data.url);
    });
  }, []);

  return (
    <EntryPage>
      <EntryCard style={{ width: '454px', padding: '40px 25px' }}>
        <h2 style={{ fontWeight: 'bold', fontFamily: 'Halyard' }}>2-STEP VERIFICATION</h2>
        <div style={{ marginTop: '20px' }}>
          {qrURL ? <img style={{ margin: 'auto' }} src={qrURL} alt="QR" /> : <p>Loading...</p>}
          <p>Please setup MFA on authenticator app</p>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ marginTop: 30, marginLeft: '60px', marginRight: '60px' }}>
          <InputGroup>
            <Input
              type="input"
              placeholder="Enter your TOTP"
              id="totp"
              value={totp}
              style={{ padding: '16px 20px 16px 30px', color: 'rgba(255,255,255,0.5)' }}
              onChange={handleTOTPInputChange}
            />
          </InputGroup>
          {error && <p style={{ marginBottom: '10px', color: 'red' }}>{error}</p>}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input name="twoStep" type="checkbox" value="false" style={{ width: 'auto' }} />
            <p
              style={{
                paddingLeft: '12px',
                fontSize: '12px',
                color: 'white',
                fontFamily: 'Halyard-Book'
              }}>
              Do you want sms login for 2 step verification?
            </p>
          </div>
          <Button type="submit" full>
            CONFIRM
          </Button>
        </form>
      </EntryCard>
    </EntryPage>
  );
}

export default SigninTwoStep;
