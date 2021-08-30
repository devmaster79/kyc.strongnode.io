import { Field, Form, Formik } from 'formik';
import React, { useLayoutEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { EntryPage } from "./style";
import EntryCard from "../components/EntryCard";
import InputGroup from "../components/InputGroup";
import Input from "../components/Input";
import Button from "../components/Button";
import Line from "../components/Line";
import { ReactComponent as MailIcon } from "../icons/message.svg";
import { ReactComponent as ProfileIcon } from "../icons/profile.svg";
import { ReactComponent as ErrorIcon } from "../icons/error.svg";

const TermsWrapper = styled.div`
  text-align: left;
  display: flex;
  margin-bottom: 30px;
  & p {
    font-size: 14px;
    margin-top: -2px;
  }
  & input {
    margin: 0 4px -4px 0;
  }
`;

const AlreadyWrapper = styled.p`
  background: white;
  margin: -12px auto 20px;
  color: #584a72;
  font-size: 14px;
  line-height: 24px;
  width: 60%;
`;

const ValidateWrapper = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  margin-top: -10px;
  margin-bottom: 25px;
  flex-direction: row;
  justify-content: flex-start;
  p {
    margin-left: 8px;
  }
`;

function Signup() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [emailValidated, setEmailValidated] = useState(true);
  
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    return setEmailValidated(validateEmail(email));
  }, [email]);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const initFormState = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    username: "",
    termsAgreement: false
  }
  
  const handleFormSubmit = (data, {setSubmitting}) => {
    setSubmitting(true);
    // make async call to submit registration data here
    console.log("submit: ", data);
    setSubmitting(false);
  }

  return (
    <EntryPage>
      <EntryCard>
        <h2>Create an Account</h2>
        <Formik initialValues={initFormState} onSubmit={handleFormSubmit}>
          {({ isSubmitting }) => (
            <Form style={{ marginTop: 30 }}>
              <InputGroup>
                <Field
                  as={Input}
                  name="firstName"
                  placeholder="First Name"
                  type="input"
                />
              </InputGroup>
              <InputGroup>
                <Field
                  as={Input}
                  name="middleName"
                  placeholder="Middle Name"
                  type="input"
                />
              </InputGroup>
              <InputGroup>
                <Field
                  as={Input}
                  name="lastName"
                  placeholder="Last Name"
                  type="input"
                />
              </InputGroup>
              <InputGroup>
                <MailIcon />
                <Field
                  as={Input}
                  name="email"
                  placeholder="Email"
                  style={{ padding: "16px 20px 16px 40px" }}
                  type="email"
                />
              </InputGroup>
              {!emailValidated && (
                <ValidateWrapper show={{ emailValidated }}>
                  <ErrorIcon />
                  <p>Please enter a valid email address</p>
                </ValidateWrapper>
              )}
              <InputGroup>
                <ProfileIcon />
                <Field
                  as={Input}
                  name="username"
                  placeholder="User Name"
                  style={{ padding: "16px 20px 16px 40px" }}
                  type="text"
                />
              </InputGroup>
              <TermsWrapper style={{ display: "table", marginBottom: "20px" }}>
                <Field
                  as={Input} 
                  name="termsAgreement"
                  style={{ width: "auto" }}
                  type="checkbox"
                />
                <div style={{ display: "table-cell", verticalAlign: "middle" }}>
                  <p>
                    By continuing, you agree to
                    <Link to="/#">Terms of Use Privacy policy</Link>
                  </p>
                </div>
              </TermsWrapper>
              <Button disabled={isSubmitting} type="submit" full>
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
        <Line full />
        <Line full />
        <AlreadyWrapper>Already have an account</AlreadyWrapper>
        <Button onClick={() => history.push("/profile")} full white>
          Sign In
        </Button>
      </EntryCard>
    </EntryPage>
  );
}

export default Signup;
