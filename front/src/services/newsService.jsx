import axios from 'axios'
import { get_news } from '../utils/config'

const getNews = () => {
  return axios.get(get_news)
}

export default getNews
