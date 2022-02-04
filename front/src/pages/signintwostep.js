import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntryPage } from './style';
import Button from '../components/Button';
import EntryCard from '../components/EntryCard';
import Input from '../components/Input';
import InputGroup from '../components/InputGroup';
import { checkSMS, createQR, verifyTOTP } from '../utils/api';

function SigninTwoStep() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [totp, setTOTP] = useState('');
  const [showError, setShowError] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrURL, setQRURL] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    verifyTOTP(email, totp).then((r) => {
      if (r.data.verified) {
        checkSMS(email).then((r) => {
          if (r.data[0].enable_sms === true) {
            navigate('/signinsms');
          } else {
            navigate('/dashboard/app');
          }
        });
      } else {
        setShowError(true);
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
    const email = localStorage.getItem('email');
    if (email !== '') {
      setEmail(email);
    }

    async function fetchUser() {
      try {
        checkSMS(email).then((r) => {
          if (r.data[0].enable_totp) {
            setShowQR(false);
          } else {
            setShowQR(true);
            createQR(email).then((rq) => {
              setQRURL(rq.data.url);
            });
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
    fetchUser();
  }, []);

  return (
    <EntryPage>
      <EntryCard style={{ width: '454px', padding: '40px 25px' }}>
        <h2 style={{ fontWeight: 'bold', fontFamily: 'Halyard' }}>2-STEP VERIFICATION</h2>
        {!showQR && <h5>Re-enter your OTP for Verification</h5>}
        {showQR && (
          <div style={{ marginTop: '20px' }}>
            <img style={{ margin: 'auto' }} src={qrURL} alt="qr" />
            <p>Please setup MFA on authenticator app</p>
          </div>
        )}
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
          {showError && (
            <p style={{ marginBottom: '10px', color: 'red' }}>Invalid code please try again</p>
          )}
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
