import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { EntryPage } from "./style";
import Button from "../components/Button";
import EntryCard from "../components/EntryCard";
import Input from "../components/Input";
import Line from "../components/Line";
import ValidatedField from "../components/ValidatedField";
import { signupSchema } from "../static/formSchemas";

const AlreadyWrapper = styled.p`
  background: white;
  margin: -12px auto 20px;
  color: #584a72;
  font-size: 14px;
  line-height: 24px;
  width: 60%;
`;

function Signup() {
  const history = useHistory();
  
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
        <Formik
          initialValues={initFormState}
          onSubmit={handleFormSubmit}
          validateOnChange
          validationSchema={signupSchema}
        >
          {({ isSubmitting }) => (
            <Form style={{ marginTop: 30 }}>
              <ValidatedField
                as={Input}
                name="firstName"
                placeholder="First Name"
                type="input"
              />
              <ValidatedField
                as={Input}
                name="middleName"
                placeholder="Middle Name"
                type="input"
              />
              <ValidatedField
                as={Input}
                name="lastName"
                placeholder="Last Name"
                type="input"
              />
              <ValidatedField
                as={Input}
                name="email"
                placeholder="Email"
                style={{ padding: "16px 20px 16px 40px" }}
                type="email"
              />
              <ValidatedField
                as={Input}
                name="username"
                placeholder="User Name"
                style={{ padding: "16px 20px 16px 40px" }}
                type="text"
              />
              <ValidatedField
                as={Input} 
                name="termsAgreement"
                style={{ display: "table-cell", width: "auto" }}
                wrapperStyle={{display: "table"}}
                type="checkbox"
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
        <Button onClick={() => history.push("/profile")} full white>
          Sign In
        </Button>
      </EntryCard>
    </EntryPage>
  );
}

export default Signup;
