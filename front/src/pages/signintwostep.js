import React, { useState } from "react";
import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { EntryPage } from "./style";
import Button from "../components/Button";
import EntryCard from "../components/EntryCard";
import Input from "../components/Input";
import InputGroup from "../components/InputGroup";
import { ReactComponent as LockIcon } from "../icons/lock.svg";
import ValidatedField from "../components/ValidatedField";
import { signupSchema } from "../static/formSchemas";

function SigninTwoStep() {
  const history = useHistory();

  const initFormState = {
    email: ""
  }

  const [password, setPassword] = useState("");
  const [sms, setSMS] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    history.push("/profile");
  };

  const handlePasswordInputChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = (data, { setSubmitting }) => {
    setSubmitting(true);
    // make async call to submit registration data here
    console.log("submit: ", data);
    setSubmitting(false);
  }

  return (
    <EntryPage>
      <EntryCard>
        <h2>2-Step Verification</h2>
        <h5>Re-enter your OTP for Verification</h5>
        <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
          <InputGroup>
            <LockIcon />
            <Input
              type="input"
              placeholder="Enter your 2FA code"
              id="2fa"
              value={password}
              style={{ padding: "16px 20px 16px 40px" }}
              onChange={handlePasswordInputChange}
            />
          </InputGroup>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input name="twoStep" type="checkbox" value="false" style={{ width: 'auto' }} />
            <p style={{ paddingLeft: '12px' }}>Do you want sms login for 2 step verification?</p>
          </div>
          <Button type="submit" full>
            Confirm
          </Button>
        </form>
      </EntryCard>
    </EntryPage>
  );
}

export default SigninTwoStep;
