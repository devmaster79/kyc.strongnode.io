import axios from 'axios';
import { findAllVested, findAllWithdrawn, history_url } from '../utils/config'

export default {
  createHistory(data) {
    return axios.post(history_url, data);
  },
  updateHistory(id, data) {
    return axios.put(`${history_url}/${id}`, data);
  },
  deleteHistory(id) {
    return axios.delete(`${history_url}/${id}`);
  },
  findAllVested(user_name) {
    return axios.get(`${findAllVested}?user_name=${user_name}`);
  },
  findAllWithdrawn(user_name) {
    return axios.get(`${findAllWithdrawn}?user_name=${user_name}`);
  },
}