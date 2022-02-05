import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@material-ui/system';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { EntryPage } from './style';
import Button from '../components/Button';
import EntryCard from '../components/EntryCard';
import Input from '../components/Input';
import ValidatedField from '../components/ValidatedField';
import { signupSchema } from '../static/formSchemas';
import signup from '../utils/api';

const AlreadyWrapper = styled.p`
  background: transparent;
  color: white;
  font-size: 12px;
  line-height: 24px;
  width: 200px;
  font-family: 'All Round Gothic';
  text-align: center;
`;

const SigninButton = styled(EntryCard)`
  padding: 10px 0px;
  color: white;
  font-size: 19px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  :hover {
    box-shadow: 0px 5px 5px rgba(255, 255, 255, 0.25);
  }
`;
function Signup() {
  const navigate = useNavigate();

  const [showError, setShowError] = useState(false);

  const initFormState = {
    first_name: '',
    last_name: '',
    email: '',
    user_name: '',
    termsAgreement: false
  };

  const handleFormSubmit = (data, { setSubmitting }) => {
    if (data.email !== null) {
      data.email = data.email.toLowerCase();
    }
    setSubmitting(true);
    handleSignup(data);
    setSubmitting(false);
  };

  const handleSignup = useCallback(async (data) => {
    try {
      const resp = await signup(data);
      if (resp.data.result) {
        localStorage.setItem('email', resp.data.data.email);
        navigate('/sent-email');
      } else {
        //should show notification with signup failure.
      }
    } catch (err) {
      if (err == 'Error: Request failed with status code 409') {
        setShowError(true);
      } else {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    const user_email = localStorage.getItem('email');
    const loggedin = localStorage.getItem('loggedin');
    if (user_email != null && loggedin === 'true') {
      navigate('/dashboard/app');
    }
  }, []);

  return (
    <EntryPage>
      <EntryCard>
        <h2 style={{ fontFamily: 'Halyard' }}>CREATE AN ACCOUNT</h2>
        <Formik
          initialValues={initFormState}
          onSubmit={handleFormSubmit}
          validationSchema={signupSchema}>
          {({ handleBlur, isSubmitting, validateField }) => (
            <Form style={{ marginTop: 30 }}>
              <ValidatedField
                as={Input}
                name="first_name"
                onBlur={handleBlur}
                placeholder="First name"
                type="input"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="last_name"
                onBlur={handleBlur}
                placeholder="Last name"
                type="input"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="email"
                onBlur={handleBlur}
                placeholder="Email"
                style={{ padding: '16px 20px 16px 40px' }}
                type="email"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="user_name"
                onBlur={handleBlur}
                placeholder="Username"
                style={{ padding: '16px 20px 16px 40px' }}
                type="text"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="termsAgreement"
                onBlur={handleBlur}
                style={{ width: 'auto' }}
                type="checkbox"
                wrapperStyle={{
                  alignItems: 'center',
                  display: 'flex',
                  height: '9px!important',
                  width: '9px!important'
                }}
              />
              {showError && (
                <p style={{ marginBottom: '10px', color: 'red' }}>
                  There is a user with same email.
                </p>
              )}
              <Button disabled={isSubmitting} type="submit" full>
                SIGN UP
              </Button>
            </Form>
          )}
        </Formik>
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
        <AlreadyWrapper>Already have an account?</AlreadyWrapper>
        <Box height="1px" backgroundColor="rgba(255, 255, 255, 0.25)" width="calc(50% - 100px)" />
      </Box>
      <SigninButton onClick={() => navigate('/signin')}>SIGN IN</SigninButton>
    </EntryPage>
  );
}

export default Signup;
