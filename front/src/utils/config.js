// "http://localhost:8080"

const base_url = process.env.REACT_APP_BASE_URL + '/api';

// USER
export const signup_url = `${base_url}/users`;
export const verify_email_url = `${base_url}/users/verifyEmail`;
export const password_url = `${base_url}/users/createPassword`;
export const password_reset_url = `${base_url}/users/passwordReset`;
export const password_reset_submit_url = `${base_url}/users/passwordResetSubmit`;
export const investor_url = `${base_url}/users/createInvestor`;
export const signin_url = `${base_url}/users/signin`;
export const send_sms_url = `${base_url}/users/sms/send`;
export const auth_sms_url = `${base_url}/users/sms/auth`;
export const test_auth_sms_url = `${base_url}/users/sms/testAuth`;
export const generate_qr_url = `${base_url}/users/qr/generate`;
export const auth_qr_url = `${base_url}/users/qr/auth`;
export const test_auth_qr_url = `${base_url}/users/qr/testAuth`;
export const upload_profile_img = `${base_url}/users/profile/image`;
export const profile_url = `${base_url}/users/profile`;


// HISTORY
export const findAllVested = `${base_url}/history/findAllVested`;
export const findAllWithdrawn = `${base_url}/history/findAllWithdrawn`;
export const history_url = `${base_url}/history`;

// NEWS
export const get_news = `${base_url}/news`;


export default base_url;
