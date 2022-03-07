import { Form, Formik, FormikHelpers } from "formik";
import { EntryPage } from "../style";
import Button from "../../components/Button";
import EntryCard from "../../components/EntryCard";
import Input from "../../components/Input";
import ValidatedField from "../../components/ValidatedField";
import { verifyEmailSchema } from "../../static/formSchemas";
import * as authState from "../../services/auth";
import styled from "styled-components";
import { useService } from "hooks/useService";

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
                style={{ padding: "16px 20px 16px 40px" }}
                type="email"
                validateField={validateField}
              />
              {/* eslint-disable prettier/prettier */}
              <SendMsg>
                {sendResult.result === "loading" && "Sending the email..."}
                {sendResult.result === "success" &&
                  "We have successfully sent you an email. You can close this tab now."}
                {sendResult.result === "validation-error" && (
                  <Error>Wrong email. Please try agian.</Error>
                )}
                {sendResult.result === "unexpected-error" && (
                  <Error>Something went wrong. Please try again later.</Error>
                )}
              </SendMsg>
              {/* eslint-enable prettier/prettier */}
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

const SendMsg = styled.div`
  margin-bottom: 10px;
`;
const Error = styled.div`
  color: #e7b3ff;
`;
