import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { EntryPage } from './style';
import Button from '../components/Button';
import EntryCard from '../components/EntryCard';
import Input from '../components/Input';
import InputGroup from '../components/InputGroup';
import { ReactComponent as LockIcon } from '../icons/lock.svg';
import { ReactComponent as MailIcon } from '../icons/message.svg';
import { signin, checkSMS } from '../utils/api';

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #4d79f6;
  margin-top: 30px;
  p {
    font-style: normal;
    font-size: 16px;
    line-height: 22px;
    color: #4d79f6;
    margin: 0 0 0 10px;
  }
`;

function SigninPass() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [wrongPassWarning, setPassWrong] = useState(false);

  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //Need to implement auth for login
    try {
      signin(email, password)
        .then((r) => {
          if (r.status === 200) {
            localStorage.setItem('token', r.data.token);
            localStorage.setItem('username', r.data.user_name);
            localStorage.setItem('loggedin', true);
            checkSMS(email).then((r) => {
              if (r.data[0].enable_totp === true) {
                navigate('/signintwostep');
              } else if (r.data[0].enable_sms === true) {
                navigate('/signinsms');
              } else {
                navigate('/dashboard/app');
              }
            });
          } else if (r.status === 401) {
            setPassWrong(true);
            setPassword('');
          } else {
            setShowError(true);
            setPassword('');
          }
        })
        .catch((err) => {
          if (err == 'Error: Request failed with status code 401') {
            setPassWrong(true);
            setPassword('');
          } else {
            setShowError(true);
            setPassword('');
          }
        });
    } catch (e) {
      setShowError(true);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email !== '') {
      setEmail(email);
    }
  }, []);

  return (
    <EntryPage>
      <EntryCard>
        <h2>Welcome</h2>
        <UserInfoWrapper>
          <MailIcon />
          <p>{email}</p>
        </UserInfoWrapper>
        <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
          <InputGroup>
            <LockIcon />
            <Input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              style={{ padding: '16px 20px 16px 40px' }}
              onChange={handlePasswordInputChange}
            />
          </InputGroup>
          {showError && (
            <p style={{ marginBottom: '10px', color: 'red' }}>
              Invalid email and password. please try again
            </p>
          )}
          {wrongPassWarning && (
            <p style={{ marginBottom: '10px', color: 'red' }}>Wrong password. please try again</p>
          )}
          <Button type="submit" full>
            Confirm
          </Button>
        </form>
      </EntryCard>
    </EntryPage>
  );
}

export default SigninPass;
