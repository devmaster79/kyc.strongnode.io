import * as yup from "yup";

export const signupSchema = yup.object({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup.string().email().required(),
  user_name: yup.string().required(),
  termsAgreement: yup.bool().oneOf([true])
});

export const singinSchema = yup.object({
  email: yup.string().email().required(),
});