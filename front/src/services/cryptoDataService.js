import axios from 'axios'
import {
  getCryptoChartData,
  getTokenMetrics as _getTokenMetrics
} from '../utils/config'

const getChartDataAsync = async (scope = 'days') => {
  const url = getCryptoChartData + '?scope=' + scope
  return await axios.get(url)
}
const getTokenMetrics = async () => {
  // todo add the parameter to call only data for one token
  return await axios.get(_getTokenMetrics)
}

const cryptoService = {
  getChartDataAsync,
  getTokenMetrics
}

export default cryptoService
