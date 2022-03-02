import axios from 'axios';
import { upload_profile_img, signup_url,
  password_reset_url, password_reset_submit_url, verify_email_url, password_url,
  profile_url, investor_url, signin_url, send_sms_url, test_auth_sms_url, auth_sms_url, auth_qr_url,
  generate_qr_url, test_auth_qr_url, password_change } from '../utils/config'

export default {
  signin(email, password) {
    return axios.put(signin_url, {
      email: email,
      password: password
    });
  },
  signup(data) {
    return axios.post(signup_url, data);
  },
  requestPasswordReset(email) {
    return axios.get(`${password_reset_url}?email=${email}`);
  },
  passwordResetSubmit(password, token) {
    return axios.post(password_reset_submit_url,
      {
        password: password,
        token: token,
      });
  },
  getProfile() {
    return axios.get(profile_url);
  },
  verifyEmail(data) {
    return axios.put(verify_email_url, data);
  },
  createPassword(data) {
    return axios.put(password_url, data);
  },
  changePassword(data) {
    return axios.put(password_change, data);
  },
  createProfile(data) {
    return axios.post(profile_url, data);
  },
  createInvestor(data) {
    return axios.put(investor_url, data);
  },
  updateProfile(data) {
    return axios.put(profile_url, data);
  },
  uploadProfileImage(email, user_name, img_data) {
    return axios.put(upload_profile_img,
      {
        email: email,
        user_name: user_name,
        image_data: img_data
      });
  },
  setToken(token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  /*
   * SMS Auth
   */

  /** Send SMS OTP to the preauthed user's number */
  sendSMS() {
    return axios.post(send_sms_url);
  },
  /** Check SMS code validity and progress the auth flow in case of valid sms. */
  authSMS(smscode) {
    return axios.post(auth_sms_url, {
      smscode
    })
  },

  /*
   * Setup SMS Auth
   */

  /** Send SMS OTP and store phone number to authed user */
  testSendSMS(number) {
    return axios.post(send_sms_url, {
      number: number
    });
  },
  /** Check SMS code validity only. */
  testAuthSMS(smscode) {
    return axios.post(test_auth_sms_url, {
      smscode
    })
  },

  /*
   * QR Auth
   */

  authQR(otp) {
    return axios.post(auth_qr_url, {
      token: otp
    });
  },

  /*
   * Setup QR Auth
   */

  generateQR() {
    return axios.post(generate_qr_url);
  },
  testAuthQR(otp) {
    return axios.post(test_auth_qr_url, {
      token: otp
    });
  }
}