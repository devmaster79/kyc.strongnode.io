import axios from 'axios';
import { findAllVested, findAllWithdrawn, findWithdrawnDetails, history_url, findVestedDetails } from '../utils/config'

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
  findAllVested(user_name, page, perPage) {
    return axios.get(`${findAllVested}?user_name=${user_name}&page=${page}&perPage=${perPage}`);
  },
  findAllWithdrawn(user_name, page, perPage) {
    return axios.get(`${findAllWithdrawn}?user_name=${user_name}&page=${page}&perPage=${perPage}`);
  },
  findWithdrawnDetails(user_name) {
    return axios.get(`${findWithdrawnDetails}?user_name=${user_name}`);
  },
  findVestedDetails(user_name) {
    return axios.get(`${findVestedDetails}?user_name=${user_name}`);
  }
}