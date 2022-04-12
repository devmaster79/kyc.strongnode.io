import axios from 'axios'

const baseUrl = 'https://api.coingecko.com/api/v3/'
const marketChart = 'coins/{ID}/market_chart'

export default {
  async getChartDataAsync (days = 7, vsCurrency = 'usd', cryptoId = 'strongnode') {
    const url =
      baseUrl +
      marketChart.replace('{ID}', cryptoId) +
      '?days=' +
      days +
      '&vs_currency=' +
      vsCurrency
    return await axios.get(url)
  }
}
