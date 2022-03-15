import { Form, Formik, FormikHelpers, Field } from "formik";
import { EntryPage } from "../style";
import Button from "../../components/Button";
import EntryCard from "../../components/EntryCard";
import ValidatedField from "../../components/ValidatedField";
import { verifyEmailSchema } from "../../static/formSchemas";
import * as authState from "../../services/auth";
import styled from "styled-components";
import { useService } from "../../hooks/useService";
import { Input } from "@mui/material";

export function VerifyEmail() {
  const { data: sendResult, call: sendVerificationEmail } = useService(
    authState.sendVerificationEmail
  );

  const formState = {
    email: "",
  };

  const handleFormSubmit = async (
    data: typeof formState,
    { setSubmitting }: FormikHelpers<typeof formState>
  ) => {
    setSubmitting(true);
    await sendVerificationEmail(data.email);
  };

  return (
    <EntryPage>
      <EntryCard>
        <h2>Sign in / Register</h2>
        <h5>We will send a magic link to your email</h5>
        <Formik
          initialValues={formState}
          onSubmit={handleFormSubmit}
          validationSchema={verifyEmailSchema}
        >
          {({ handleBlur, isSubmitting, validateField }) => (
            <Form style={{ marginTop: 30 }}>
              <ValidatedField
                as={Input}
                name="email"
                onBlur={handleBlur}
                placeholder="Email"
                style={{ padding: "16px 20px 16px 40px", width: "100%" }}
                type="email"
                validateField={validateField}
              />
              {sendResult.result === "loading" && (
                <Info>Sending the email...</Info>
              )}
              {sendResult.result === "success" && (
                <Info>
                  We have successfully sent you an email. You can close this tab
                  now.
                </Info>
              )}
              {sendResult.result === "validation-error" && (
                <Error>Wrong email. Please try agian.</Error>
              )}
              {sendResult.result === "unexpected-error" && (
                <Error>Something went wrong. Please try again later.</Error>
              )}
              <Button disabled={isSubmitting} type="submit" full>
                Confirm
              </Button>
            </Form>
          )}
        </Formik>
      </EntryCard>
    </EntryPage>
  );
}

const Error = styled("p")({
  textAlign: "center",
  marginBottom: "10px",
  color: '#ff6868',
});

const Info = styled("p")({
  textAlign: "center",
  marginBottom: "10px",
  color: "#dddddd",
});
