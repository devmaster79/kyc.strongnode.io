import { Field, useField } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as ErrorIcon } from '../../icons/error.svg';
import { ReactComponent as MailIcon } from '../../icons/message.svg';
import { ReactComponent as ProfileIcon } from '../../icons/profile.svg';
import { ReactComponent as LockIcon } from '../../icons/lock.svg';
import { ReactComponent as UserIcon } from '../../icons/username.svg';
import InputGroup from '../InputGroup';

const ErrorWrapper = styled.div`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  margin-top: -10px;
  margin-bottom: 25px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  p {
    margin-left: 8px;
    color: red;
    font-size: 12px;
  }
  > svg {
    
  }
  > svg > path {
    fill: white;
  }
`;

const TermsText = () => (
  <p
    style={{
      fontSize: '12px',
      paddingLeft: '12px',
      color: 'white',
      fontFamily: 'Halyard-Book'
    }}>
    By continuing, you agree to <Link to="/#">Terms of Use</Link> Privacy Policy.
  </p>
);

const ValidatedField = (props) => {
  const { as, validateField, placeholder, style, type, wrapperStyle } = props;

  const [field, meta] = useField(props);
  const { error, touched } = meta;
  const errorText = error && touched ? error : '';

  const _inValidMsg = "Please enter ";
  let _errorText = "";
  switch (field.name) {
    case 'email':
      _errorText = 'email';
      break;
    case 'first_name':
      _errorText = 'first name';
      break;
    case 'last_name':
      _errorText = 'last name';
      break;
    case 'user_name':
      _errorText = 'user name';
      break;
  }
  _errorText = _inValidMsg + _errorText + ".";
  if (field.name === 'termsAgreement') {
    _errorText = 'You should agree terms and condition for sign up.';
  }

  return (
    <>
      <InputGroup>
        {field.name === 'email' && <MailIcon style={{ marginLeft: '10px' }} />}
        {field.name === 'username' && <ProfileIcon />}
        {field.name === 'password' && <LockIcon />}
        {field.name === 'user_name' && <UserIcon style={{ marginLeft: '10px' }} />}
        <div style={wrapperStyle}>
          <Field
            as={as}
            placeholder={placeholder}
            style={style}
            type={type}
            validate={validateField}
            {...field}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            style={{
              paddingLeft: (field.name === 'email' || field.name === 'user_name') && '55px',
              width: field.name === 'termsAgreement' && 'unset',
              height: field.name === 'termsAgreement' && 'unset'
            }}
          />
          {field.name === 'termsAgreement' && <TermsText />}
        </div>
      </InputGroup>
      {touched && (
        <ErrorWrapper show={error}>
          <ErrorIcon width={12} />
          <p>{_errorText}</p>
        </ErrorWrapper>
      )}
    </>
  );
};

export default ValidatedField;
