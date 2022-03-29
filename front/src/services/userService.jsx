import axios from 'axios';
import {
  upload_profile_img,
  profile_url,
  investor_url,
  get_investor_details,
  create_support_request
} from '../utils/config';

export default {
  getProfile() {
    return axios.get(profile_url);
  },
  getInvestorDetails() {
    return axios.get(get_investor_details);
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
    return axios.put(upload_profile_img, {
      email: email,
      user_name: user_name,
      image_data: img_data
    });
  },
  createSupportRequest(data) {
    return axios.post(create_support_request, data);
  }
};
