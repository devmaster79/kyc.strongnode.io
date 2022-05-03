import axios from 'axios'
import { get_news } from '../utils/config'

export default {
  getNews() {
    return axios.get(get_news)
  }
}
