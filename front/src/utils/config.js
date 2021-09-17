// "http://localhost:8080"

const base_url = process.env.REACT_APP_BASE_URL + '/api';
export const signup_url = `${base_url}/users`;
export const password_url = `${base_url}/users/createPassword`;
export const signin_url = `${base_url}/users/signin`;
export const sms_url = `${base_url}/users/sms/send`;
export const check_sms_url = `${base_url}/users/sms/check`;
export const qr_url = `${base_url}/users/totp/qrcode`;
export const verify_qr_url = `${base_url}/users/totp/verify`;
export const get_news = `${base_url}/news`;
export default base_url;