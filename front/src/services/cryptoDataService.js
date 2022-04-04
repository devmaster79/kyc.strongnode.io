import axios from 'axios';

const baseUrl = 'https://api.coingecko.com/api/v3/';
const marketChart = 'coins/{ID}/market_chart';

export default {
  async getChartDataAsync(cryptoId = 'strongnode', days = 130, vsCurrency = 'usd') {
    const url =
      baseUrl +
      marketChart.replace('{ID}', cryptoId) +
      '?days=' +
      days +
      '&vs_currency=' +
      vsCurrency;
    return await axios.get(url);
  }
};
