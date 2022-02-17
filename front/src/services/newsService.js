import axios from 'axios';
import { get_news } from '../utils/config'

const token = localStorage.getItem('token');

export default {
  getNews() {
    return axios.get(get_news, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}