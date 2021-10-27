import axios from "axios";
import {
  signup_url,
  verify_email_url,
  password_url,
  profile_url,
  investor_url,
  sms_url,
  check_sms_url,
  qr_url,
  verify_qr_url,
  signin_url,
} from "./config";
import {
  get_news,
  get_profile,
  update_profile,
  upload_profile_img,
} from "./config";

const token = localStorage.getItem("token");

const signup = async (data) => {
  const config = {
    url: signup_url,
    method: "POST",
    data: data,
  };
  return axios(config);
};

const verifyEmail = async (data) => {
  const config = {
    url: verify_email_url,
    method: "PUT",
    data: data,
  };
  return axios(config);
};

const createPassword = async (data) => {
  const config = {
    url: password_url,
    method: "PUT",
    data: data,
  };
  return axios(config);
};

const createProfile = async (data) => {
  console.log("token?", token);
  const config = {
    url: profile_url,
    headers: { Authorization: `Bearer ${token}` },
    method: "PUT",
    data: data,
  };
  return axios(config);
};

const createInvestor = async (data) => {
  const config = {
    url: investor_url,
    headers: { Authorization: `Bearer ${token}` },
    method: "PUT",
    data: data,
  };
  return axios(config);
};

const signin = async (email, password) => {
  const config = {
    url: signin_url,
    method: "PUT",
    data: {
      email: email,
      password: password,
    },
  };
  return axios(config);
};

const sendSMS = async (number, email) => {
  const config = {
    url: sms_url,
    method: "POST",
    data: {
      number: number,
      email: email,
    },
  };
  return axios(config);
};

const checkSMS = async (email) => {
  const config = {
    url: check_sms_url,
    method: "GET",
    params: {
      email: email,
    },
  };
  return axios(config);
};

const createQR = async (email) => {
  const config = {
    url: qr_url,
    method: "PUT",
    data: {
      email: email,
    },
  };
  return axios(config);
};

const verifyTOTP = async (email, token) => {
  const config = {
    url: verify_qr_url,
    method: "POST",
    data: {
      email: email,
      token: token,
    },
  };
  return axios(config);
};

const getNews = async () => {
  const config = {
    url: get_news,
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios(config);
};

const getProfile = async (email) => {
  const config = {
    url: get_profile,
    method: "GET",
    params: {
      email: email,
    },
  };
  return axios(config);
};

const updateProfile = async (data) => {
  const config = {
    url: update_profile,
    method: "PUT",
    data: data,
  };
  return axios(config);
};

const uploadProfileImage = async (email, user_name, img_data) => {
  const config = {
    url: upload_profile_img,
    method: "PUT",
    data: {
      email: email,
      user_name: user_name,
      image_data: img_data,
    },
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
  checkSMS,
  createQR,
  verifyTOTP,
};
export { getNews, getProfile, updateProfile, uploadProfileImage };
