import axios from 'axios';
import {
  sms_url,
  check_sms_url,
  qr_url,
  verify_qr_url
} from "./config";

const sendSMS = async (number, email) => {
  const config = {
    url: sms_url,
    method: 'POST',
    data: {
      number: number,
      email: email
    }
  };
  return axios(config);
};

const checkSMS = async (email) => {
  const config = {
    url: check_sms_url,
    method: 'GET',
    params: {
      email: email
    }
  };
  return axios(config);
};

const createQR = async (email) => {
  const config = {
    url: qr_url,
    method: 'PUT',
    data: {
      email: email
    }
  };
  return axios(config);
};

const verifyTOTP = async (email, token) => {
  const config = {
    url: verify_qr_url,
    method: 'POST',
    data: {
      email: email,
      token: token
    }
  };
  return axios(config);
};

export {
  sendSMS,
  checkSMS,
  createQR,
  verifyTOTP
};
