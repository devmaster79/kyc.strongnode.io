import axios from 'axios';
import { getCryptoChartData, getTokenMetrics } from '../utils/config';

export default {
  async getChartDataAsync(scope = 'days') {
    const url = getCryptoChartData + '?scope=' + scope;
    return await axios.get(url);
  },
  async getTokenMetrics() {
    // todo add the parameter to call only data for one token
    return await axios.get(getTokenMetrics);
  }
};
