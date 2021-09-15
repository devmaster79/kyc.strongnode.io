const url = "http://localhost:8080/api/users";
export const signup_url = `${url}/`;
export const password_url = `${url}/createPassword`;
export const signin_url = `${url}/signin`;
export const sms_url = `${url}/sms/send`;
export const check_sms_url = `${url}/sms/check`;
export const qr_url = `${url}/totp/qrcode`;
export const verify_qr_url = `${url}/totp/verify`;
export default url;