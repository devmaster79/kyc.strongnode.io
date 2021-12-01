import React, { useCallback, useEffect, useState } from "react";
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

  const [showError, setShowError] = useState(false);

  const initFormState = {
    first_name: "",
    last_name: "",
    email: "",
    user_name: "",
    termsAgreement: false,
  };

  const handleFormSubmit = (data, { setSubmitting }) => {
    if (data.email !== null ) {
      data.email = data.email.toLowerCase();
    }
    setSubmitting(true);
    handleSignup(data);
    setSubmitting(false);
  };

  const handleSignup = useCallback(
    async (data) => {
      try {
        const resp = await signup(data);
        if (resp.data.result) {
          localStorage.setItem("email", resp.data.data.email);
          navigate("/sent-email");
        } else {
          //should show notification with signup failure.
        }
      } catch (err) {
        if(err === "Error: Request failed with status code 409") {
          setShowError(true);
        } else {
          console.log(err);
        }
      }
    },
    []
  );

  useEffect(() => {
    const user_email = localStorage.getItem("email")
    const loggedin = localStorage.getItem("loggedin")
    if (user_email != null && loggedin === "true") {
      navigate("/dashboard/app");
    }
  }, [])

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
              {showError && <p style={{marginBottom: "10px", color: "red"}}>There is a user with same email.</p>}
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
