import React, { useState, useCallback, useEffect } from "react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { EntryPage } from "./style";
import Button from "../components/Button";
import EntryCard from "../components/EntryCard";
import Input from "../components/Input";
import Line from "../components/Line";
import ValidatedField from "../components/ValidatedField";
import { signupSchema } from "../static/formSchemas";
import signup from "../utils/api";

const AlreadyWrapper = styled.p`
  background: white;
  margin: -12px auto 20px;
  color: #584a72;
  font-size: 14px;
  line-height: 24px;
  width: 60%;
`;

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const initFormState = {
    first_name: "",
    last_name: "",
    email: "",
    user_name: "",
    termsAgreement: false,
  };

  const handleFormSubmit = (data, { setSubmitting }) => {
    setSubmitting(true);
    // make async call to submit registration data here
    handleSignup(data);
    console.log("submit: ", data);
    setSubmitting(false);
  };

  const handleSignup = useCallback(
    async (data) => {
      const email = data.email;
      try {
        localStorage.setItem("email", email);
        navigate("/sent-email");
        await signup(data);
      } catch (err) {
        console.log("Error for signup", err);
      }
    },
    []  
  );

  return (
    <EntryPage>
      <EntryCard>
        <h2>Create an Account</h2>
        <Formik
          initialValues={initFormState}
          onSubmit={handleFormSubmit}
          validationSchema={signupSchema}
        >
          {({ handleBlur, isSubmitting, validateField }) => (
            <Form style={{ marginTop: 30 }}>
              <ValidatedField
                as={Input}
                name="first_name"
                onBlur={handleBlur}
                placeholder="First Name"
                type="input"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="last_name"
                onBlur={handleBlur}
                placeholder="Last Name"
                type="input"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="email"
                onBlur={handleBlur}
                placeholder="Email"
                style={{ padding: "16px 20px 16px 40px" }}
                type="email"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="user_name"
                onBlur={handleBlur}
                placeholder="User Name"
                style={{ padding: "16px 20px 16px 40px" }}
                type="text"
                validateField={validateField}
              />
              <ValidatedField
                as={Input}
                name="termsAgreement"
                onBlur={handleBlur}
                style={{ width: "auto" }}
                type="checkbox"
                wrapperStyle={{
                  alignItems: "center",
                  display: "flex",
                  height: "20px",
                }}
              />
              <Button disabled={isSubmitting} type="submit" full>
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
        <Line full />
        <Line full />
        <AlreadyWrapper>Already have an account</AlreadyWrapper>
        <Button onClick={() => navigate("/signin")} full white>
          Sign In
        </Button>
      </EntryCard>
    </EntryPage>
  );
}

export default Signup;
