import axios from 'axios';
import { findAllVested, findAllWithdrawn, updateHistory, deleteHistory, createHistory } from '../utils/config'

const token = localStorage.getItem('token');

export default {
  createHistory(data) {
    return axios.post(createHistory, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  updateHistory(data) {
    return axios.post(updateHistory, data);
  },
  deleteHistory(data) {
    return axios.post(deleteHistory, data);
  },
  findAllVested(user_name) {
    return axios.get(`${findAllVested}?user_name=${user_name}`);
  },
  findAllWithdrawn(user_name) {
    return axios.get(`${findAllWithdrawn}?user_name=${user_name}`);
  },
}