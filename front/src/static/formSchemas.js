import * as yup from 'yup';

export const signupSchema = yup.object({
  first_name: yup.string().required('Please enter first name.'),
  last_name: yup.string().required('Please enter last name.'),
  email: yup.string().email().required('Please enter email.'),
  user_name: yup.string().required('Please enter user name.'),
  termsAgreement: yup.bool().oneOf([true], 'You should agree terms and condition for sign up.')
});

export const singinSchema = yup.object({
  email: yup.string().email().required('Please enter email.')
});

export const forgottenPassword = yup.object({
  email: yup.string().email().required('Please enter email.')
})

export const createNewPassword = yup.object({
})

export const changePasswordSchema = yup.object().shape({
  old_password: yup.string().required('Old password is required'),
  new_password: yup.string().required('New password is required'),
  confirm_password: yup.string().when("new_password", {
    is: val => (val && val.length > 0 ? true : false),
    then: yup.string().oneOf(
      [yup.ref("new_password")],
      "Both password need to be the same"
    )
  }),
});