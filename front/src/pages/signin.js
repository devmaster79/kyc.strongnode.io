import React, { useState, useCallback } from 'react';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { EntryPage } from './style';
import Button from '../components/Button';
import EntryCard from '../components/EntryCard';
import Input from '../components/Input';
import ValidatedField from '../components/ValidatedField';
import { magic } from '../utils/index';
import { singinSchema } from '../static/formSchemas';
import styled from 'styled-components';
import { Box } from '@material-ui/system';

const AlreadyWrapper = styled.p`
  background: transparent;
  color: white;
  font-size: 12px;
  line-height: 24px;
  width: 200px;
  font-family: 'All Round Gothic';
  text-align: center;
`;

const SignupButton = styled(EntryCard)`
  padding: 10px 0px;
  color: white;
  font-size: 19px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  :hover {
    box-shadow: 0px 5px 5px rgba(255, 255, 255, 0.25);
  }
`;

function Signin() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const magicLogin = async ({ email }) => {
    setShowError(false);
    try {
      localStorage.setItem('email', email);
      navigate('/magiclink');
      await magic.auth.loginWithMagicLink({
        email: email,
        redirectURI: new URL('/signinpass', window.location.origin).href,
        showUI: false
      });
    } catch (err) {
      console.log('Error for sending magic link', err);
      setShowError(true);
    }
  };

  const initFormState = {
    email: ''
  };

  const forgottenPassword = () => {
    navigate('/forgotten-password')
  }

  const handleFormSubmit = (data, { setSubmitting }) => {
    setSubmitting(true);
    magicLogin({
      email: data.email.toLowerCase()
    })
      .then(() => {
        setSubmitting(false);
      })
      .catch(err => console.error(err))
  };

  const resetPassStyle = {
    color: '#1DF4F6',
    marginTop: '16px',
    cursor: 'pointer'
  };

  return (
    <EntryPage>
      <EntryCard>
        <h2>Sign in</h2>
        <h5>We will send a magic link to your email</h5>
        <Formik
          initialValues={initFormState}
          onSubmit={handleFormSubmit}
          validationSchema={singinSchema}>
          {({ handleBlur, isSubmitting, validateField }) => (
            <Form style={{ marginTop: 30 }}>
              <ValidatedField
                as={Input}
                name="email"
                onBlur={handleBlur}
                placeholder="Email"
                style={{ padding: '16px 20px 16px 40px' }}
                type="email"
                validateField={validateField}
              />
              {showError && (
                <p style={{ marginBottom: '10px', color: 'red' }}>
                  Not registered, please signup first!
                </p>
              )}
              <Button disabled={isSubmitting} type="submit" full>
                Confirm
              </Button>
            </Form>
          )}
        </Formik>
        <p onClick={forgottenPassword} style={resetPassStyle}>Did you forget your password?</p>
      </EntryCard>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        maxWidth={482}
        mb="35px"
        px="10px">
        <Box height="1px" backgroundColor="rgba(255, 255, 255, 0.25)" width="calc(50% - 100px)" />
        <AlreadyWrapper>{"Don't have an account? Create one."}</AlreadyWrapper>
        <Box height="1px" backgroundColor="rgba(255, 255, 255, 0.25)" width="calc(50% - 100px)" />
      </Box>
      <SignupButton onClick={() => navigate('/signup')}>SIGN UP</SignupButton>
    </EntryPage>
  );
}

export default Signin;
