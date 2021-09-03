import { Field, useField } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { ReactComponent as ErrorIcon } from "../../icons/error.svg";
import { ReactComponent as MailIcon } from "../../icons/message.svg";
import { ReactComponent as ProfileIcon } from "../../icons/profile.svg";
import InputGroup from "../InputGroup";

const ErrorWrapper = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  margin-top: -10px;
  margin-bottom: 25px;
  flex-direction: row;
  justify-content: flex-start;
  p {
    margin-left: 8px;
  }
`;

const TermsText = () => (
  <p style={{
    fontSize: "14px",
    paddingLeft: "12px",
    }}
  >
    By continuing, you agree to
    <Link to="/#">Terms of Use Privacy policy.</Link>
  </p>
);

const ValidatedField = (props) => {
  const {as, validateField, placeholder, style, type, wrapperStyle} = props;

  const [field, meta] = useField(props);
  const {error, touched} = meta;
  const errorText = error && touched ? error : '';

  return (
    <>
      <InputGroup>
        {field.name === "email" && <MailIcon />}
        {field.name === "username" && <ProfileIcon />}
        <div style={wrapperStyle}>
          <Field
            as={as}
            placeholder={placeholder}
            style={style}
            type={type}
            validate={validateField}
            {...field}
          />
          {field.name === "termsAgreement" && <TermsText />}
        </div>
      </InputGroup>
      {touched && (
        <ErrorWrapper show={error}>
          <ErrorIcon />
          <p>{errorText}</p>
        </ErrorWrapper>
      )}
    </>
  );
}

export default ValidatedField;