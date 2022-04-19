const axios = require('axios')
const ip = require('ip')

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const port = process.env.port || 8080

const baseUrl = 'http://' + ip.address() + ':' + port + '/api'
const endpoints = {
  chart: '/cryptocurrency/refresh-strongnode-token?scope=',
  metrics: '/cryptocurrency/refresh-tokens'
}

const scopes = ['days', 'weeks', 'months', 'years']

/**
 * Refreshes all scopes chart data for localhost.
 * @returns {Promise<void>}
 */
const refreshChartData = async () => {
  for (let i = 0; i < scopes.length; i++) {
    await axios
      .get(baseUrl + endpoints.chart + scopes[i])
      .then(response => {
        return response.data
      })
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.log(error)
      })
  }
}

/**
 * Refreshes coin metrics data for localhost.
 * @returns {Promise<void>}
 */
const refreshCoinMetrics = async () => {
  await axios
    .get(baseUrl + endpoints.metrics)
    .then(response => {
      return response.data
    })
    .then(data => {
      console.log(data)
    })
    .catch(error => {
      console.log(error)
    })
}

// run the refresh
refreshChartData()
refreshCoinMetrics()
