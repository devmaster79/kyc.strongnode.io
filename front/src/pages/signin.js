import React, { useState, useCallback, useEffect } from "react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { EntryPage } from "./style";
import Button from "../components/Button";
import EntryCard from "../components/EntryCard";
import Input from "../components/Input";
import InputGroup from "../components/InputGroup";
import ValidatedField from "../components/ValidatedField";
import { ReactComponent as MailIcon } from "../icons/message.svg";
import { ReactComponent as LockIcon } from "../icons/lock.svg";
import { magic } from '../utils/index';
import { singinSchema } from "../static/formSchemas";

function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const initFormState = {
    email: ""
  }

  const handleFormSubmit = (data, { setSubmitting }) => {
    setSubmitting(true);
    // make async call to submit registration data here
    console.log("submit: ", data);
    magicLogin(data);
    setSubmitting(false);
  }

  const handleEmailInputChange = (event) => {
    setEmail(event.target.value);
  }

  const magicLogin = useCallback( async (data) => {
      const email = data.email;
      navigate("/magiclink");
      await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL("/signinpass", window.location.origin).href,
        showUI: false
      });
      const magitLoggedIn = await magic.user.isLoggedIn();
      if(magitLoggedIn) {
        localStorage.setItem('isLoggedIn', 'true');
      }
    }, [email]
  );

  return (
    <EntryPage>
      <EntryCard>
        <h2>Sign in</h2>
        <h5>We will send a magic link to your email</h5>
        <Formik
          initialValues={initFormState}
          onSubmit={handleFormSubmit}
          validationSchema={singinSchema}
        >
          {({ handleBlur, isSubmitting, validateField }) => (
            <Form style={{ marginTop: 30 }}>
              <ValidatedField
                as={Input}
                name="email"
                onBlur={handleBlur}
              placeholder="Email"
              style={{ padding: "16px 20px 16px 40px" }}
                type="email"
                validateField={validateField}
            />
              <Button
                disabled={isSubmitting}
                type="submit"
                full
              >
                Confirm
          </Button>
            </Form>
          )}
        </Formik>
      </EntryCard>
    </EntryPage>
  );
}

export default Signin;
