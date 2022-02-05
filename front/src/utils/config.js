// "http://localhost:8080"

const base_url = process.env.REACT_APP_BASE_URL + '/api';
export const signup_url = `${base_url}/users`;
export const verify_email_url = `${base_url}/users/verifyEmail`;
export const password_url = `${base_url}/users/createPassword`;
export const profile_url = `${base_url}/users/createProfile`;
export const investor_url = `${base_url}/users/createInvestor`;
export const signin_url = `${base_url}/users/signin`;
export const sms_url = `${base_url}/users/sms/send`;
export const check_sms_url = `${base_url}/users/sms/check`;
export const qr_url = `${base_url}/users/totp/qrcode`;
export const verify_qr_url = `${base_url}/users/totp/verify`;
export const get_news = `${base_url}/news`;
export const get_profile = `${base_url}/users/profile/get`;
export const update_profile = `${base_url}/users/profile/update`;
export const upload_profile_img = `${base_url}/users/profile/image`;
export default base_url;
