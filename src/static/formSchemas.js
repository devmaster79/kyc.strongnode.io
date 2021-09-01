import * as yup from "yup";

export const signupSchema = yup.object({
  firstName: yup.string().required(),
  middleName: yup.string(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  username: yup.string().required(),
  termsAgreement: yup.boolean().required()
})