import axios from 'axios';
import {
  upload_profile_img,
  verify_email_url,
  profile_url,
  investor_url
} from '../utils/config';

export default {
  getProfile() {
    return axios.get(profile_url);
  },
  verifyEmail(data) {
    return axios.put(verify_email_url, data);
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
  }
}