import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { EntryPage } from './style';
import EntryCard from '../components/EntryCard';
import InputGroup from '../components/InputGroup';
import Input from '../components/Input';
import Button from '../components/Button';
import { ReactComponent as UserIcon } from '../icons/username.svg';
import { ReactComponent as LockIcon } from '../icons/lock.svg';
import { verifyEmail, createPassword } from '../utils/api';
import PasswordStrengthBar from 'react-password-strength-bar';

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

function CreateAccountPassword() {
  const navigate = useNavigate();

  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    handleVerifyEmail();
  }, []);

  const handleVerifyEmail = useCallback(async () => {
    try {
      localStorage.setItem('password_token', location.search.split('=')[1]);
      const res = await verifyEmail({
        password_token: localStorage.getItem('password_token')
      });
      if (res.data && res.data?.user.email_verified) {
        setUserName(res.data?.user.user_name);
        localStorage.setItem('username', res.data?.user.user_name);
        localStorage.setItem('email', res.data?.user.email);
      }
    } catch (err) {
      console.error('Error for email verification', err);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) return;

    const data = {
      password_token: localStorage.getItem('password_token'),
      password: password
    };
    handleCreatePassword(data);
  };

  const handleCreatePassword = useCallback(async (data) => {
    try {
      const res = await createPassword(data);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('loggedin', true);
        navigate('/dashboard/app');
      }
    } catch (err) {
      console.error('Error for create password', err);
    }
  }, []);

  const handlePasswordInputChange = (event) => {
    if (password === event.target.value) {
      setShowError(false);
    } else {
      setShowError(true);
    }
    setPassword(event.target.value);
  };

  const handleConfirmPasswordInputChange = (event) => {
    if (password === event.target.value) {
      setShowError(false);
    } else {
      setShowError(true);
    }
    setConfirmPassword(event.target.value);
  };

  return (
    <EntryPage>
      <EntryCard>
        <h2 style={{ fontFamily: 'Halyard' }}>CREATE ACCOUNT PASSWORD</h2>
        <UserInfoWrapper>
          <UserIcon />
          <p>{userName}</p>
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
            <>
              <PasswordStrengthBar password={password} />
              <p style={{ marginBottom: '10px', color: 'red' }}>Password doesn&apos;t match!</p>
            </>
          )}
          <InputGroup>
            <LockIcon />
            <Input
              type="password"
              placeholder="Confirm password"
              id="confirm-password"
              style={{ padding: '16px 20px 16px 40px' }}
              value={confirmPassword}
              onChange={handleConfirmPasswordInputChange}
            />
          </InputGroup>
          <Button type="submit" full>
            CONFIRM / SIGN IN
          </Button>
        </form>
      </EntryCard>
    </EntryPage>
  );
}

export default CreateAccountPassword;
