import axios from 'axios';
import {
  signup_url,
  verify_email_url,
  password_url,
  profile_url,
  investor_url,
  signin_url,
  password_reset_url,
  password_reset_submit_url,
  test_auth_sms_url,
  auth_sms_url,
  generate_qr_url,
  auth_qr_url,
  test_auth_qr_url,
  send_sms_url
} from "./config";
import {
  get_news,
  get_profile,
  update_profile,
  upload_profile_img,
} from "./config";

const getToken = () => localStorage.getItem('token');

const signup = async (data) => {
  const config = {
    url: signup_url,
    method: 'POST',
    data: data
  };
  return axios(config);
};

const requestPasswordReset = async (email) => {
  const config = {
    url: password_reset_url,
    method: "GET",
    params: {
      email: email
    }
  }
  return axios(config)
}

const passwordResetSubmit = async (password, token) => {
  const config = {
    url: password_reset_submit_url,
    method: "POST",
    data: {
      password: password,
      token: token,
    },
  };
  return axios(config);
}

const verifyEmail = async (data) => {
  const config = {
    url: verify_email_url,
    method: 'PUT',
    data: data
  };
  return axios(config);
};

const createPassword = async (data) => {
  const config = {
    url: password_url,
    method: 'PUT',
    data: data
  };
  return axios(config);
};

const createProfile = async (data) => {
  const config = {
    url: profile_url,
    headers: { Authorization: `Bearer ${getToken()}` },
    method: 'PUT',
    data: data
  };
  return axios(config);
};

const createInvestor = async (data) => {
  const config = {
    url: investor_url,
    headers: { Authorization: `Bearer ${getToken()}` },
    method: 'PUT',
    data: data
  };
  return axios(config);
};

const signin = async (email, password) => {
  const config = {
    url: signin_url,
    method: 'PUT',
    data: {
      email: email,
      password: password
    }
  };
  return axios(config);
};

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

const getNews = async () => {
  const config = {
    url: get_news,
    headers: { Authorization: `Bearer ${getToken()}` }
  };
  return axios(config);
};

const getProfile = async (email) => {
  const config = {
    url: get_profile,
    method: 'GET',
    params: {
      email: email
    },
    headers: { Authorization: `Bearer ${getToken()}` }
  };
  return axios(config);
};

const updateProfile = async (data) => {
  console.log(data);
  const config = {
    url: update_profile,
    method: 'PUT',
    data: data,
    headers: { Authorization: `Bearer ${getToken()}` },
  };
  return axios(config);
};

const uploadProfileImage = async (email, user_name, img_data) => {
  const config = {
    url: upload_profile_img,
    method: 'PUT',
    data: {
      email: email,
      user_name: user_name,
      image_data: img_data
    },
    headers: { Authorization: `Bearer ${getToken()}` },
  };
  return axios(config);
};

const historyAction = async (url, data) => {
  const config = {
    url: url,
    headers: { Authorization: `Bearer ${getToken()}` },
    method: 'POST',
    data: data
  };
  return axios(config);
};

export default signup;
export {
  verifyEmail,
  createPassword,
  createProfile,
  createInvestor,
  signin,
  sendSMS,
  testAuthSMS,
  authSMS,
  generateQR,
  authQR,
  testAuthQR,
  historyAction,
  requestPasswordReset,
  passwordResetSubmit
};
export { getNews, getProfile, updateProfile, uploadProfileImage };
