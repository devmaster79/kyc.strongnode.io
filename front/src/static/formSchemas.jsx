import * as yup from 'yup'

export const signupSchema = yup.object({
  first_name: yup.string().required('Please enter first name.'),
  last_name: yup.string().required('Please enter last name.'),
  user_name: yup.string().required('Please enter user name.'),
  termsAgreement: yup
    .bool()
    .oneOf([true], 'You should agree terms and condition for sign up.')
})

export const verifyEmailSchema = yup.object({
  email: yup.string().email().required('Please enter email.')
})
