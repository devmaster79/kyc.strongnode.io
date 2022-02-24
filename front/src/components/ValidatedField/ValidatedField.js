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
    By continuing, you agree to <Link to="/terms-of-use" target="_blank">Terms of Use</Link> <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>.
  </p>
);

const ValidatedField = (props) => {
  const { as, validateField, placeholder, style, type, wrapperStyle } = props;

  const [field, meta] = useField(props);
  const { error, touched } = meta;

  return (
    <>
      <InputGroup>
        {field.name === 'email' && <MailIcon style={{ marginLeft: '10px' }} />}
        {field.name === 'username' && <ProfileIcon />}
        {type === 'password' && <LockIcon />}
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
              paddingLeft: (field.name === 'email' || field.name === 'user_name' || type === 'password') && '55px',
              width: field.name === 'termsAgreement' && 'unset',
              height: field.name === 'termsAgreement' && 'unset'
            }}
          />
          {field.name === 'termsAgreement' && <TermsText />}
        </div>
      </InputGroup>
      {touched && (
        <ErrorWrapper show={error && touched}>
          <ErrorIcon width={12} />
          <p>{error}</p>
        </ErrorWrapper>
      )}
    </>
  );
};

export default ValidatedField;
