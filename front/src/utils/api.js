import axios from 'axios';
import {
  test_auth_sms_url,
  auth_sms_url,
  generate_qr_url,
  auth_qr_url,
  test_auth_qr_url,
  send_sms_url
} from "./config";


const sendSMS = async (number) => {
  const config = {
    url: send_sms_url,
    method: 'POST',
    data: {
      number: number
    },
    headers: { Authorization: `Bearer ${getToken()}` }
  };
  return axios(config);
};

/**
 * Check SMS code validity but doesn't do anything else.
 * useful for profile SMS auth setup.
 */
const testAuthSMS = async (smscode) => {
  const config = {
    url: test_auth_sms_url,
    method: 'GET',
    params: {
      smscode
    },
    headers: { Authorization: `Bearer ${getToken()}` }
  };
  return axios(config);
};

/**
 * Check SMS code validity and progress the auth flow in case of valid sms.
 */
const authSMS = async (smscode) => {
  const config = {
    url: auth_sms_url,
    method: 'GET',
    params: {
      smscode
    },
    headers: { Authorization: `Bearer ${getToken()}` }
  };
  return axios(config);
};

const generateQR = async () => {
  const config = {
    url: generate_qr_url,
    method: 'PUT',
    headers: { Authorization: `Bearer ${getToken()}` }
  };
  return axios(config);
};

const authQR = async (otp) => {
  const config = {
    url: auth_qr_url,
    method: 'POST',
    data: {
      token: otp
    },
    headers: { Authorization: `Bearer ${getToken()}` }
  };
  return axios(config);
};

const testAuthQR = async (otp) => {
  const config = {
    url: test_auth_qr_url,
    method: 'POST',
    data: {
      token: otp
    },
    headers: { Authorization: `Bearer ${getToken()}` }
  };
  return axios(config);
};

export {
  sendSMS,
  testAuthSMS,
  authSMS,
  generateQR,
  authQR,
  testAuthQR
};
