const axios = require('axios')
const cron = require('node-cron');

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../../../../.env') });

// let the script updates production and stage envs
const baseUrl = (process.env.NODE_ENV === 'production') ? 'https://id.strongnode.io' : 'https://stage.strongonde.io'

const chartUrl = '/api/cryptocurrency/refresh-strongnode-token?scope='
const tokensUrl = '/api/cryptocurrency/refresh-tokens'

/**
 * This should be called every 5 minutes, since the Coingecko data granuality is 5 minutes for the days interval.
 * @returns {Promise<void>}
 */
async function refreshChartData (scope) {
  await axios
    .get(baseUrl + chartUrl + scope)
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

/**
 * This should be called every 10 seconds.
 * @returns {Promise<void>}
 */
const refreshCoinMetricsData = async () => {
  await axios
    .get(baseUrl + tokensUrl)
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

// refresh coins metrics every 10 seconds
cron.schedule('*/10 * * * * *', function () {
  refreshCoinMetricsData().then(() => {
    console.log('Coin metrics data refreshed!')
  })
})

// refresh days scope every 5 minutes
cron.schedule('* */5 * * * *', function () {
  refreshChartData('days').then(() => {
    console.log('Days chart data refresh!')
  })
})

// refresh weeks and months scope every 1 hour
cron.schedule('0 * * * *', function () {
  refreshChartData('weeks').then(() => {
    console.log('Weeks chart data refresh!')
  })
  refreshChartData('months').then(() => {
    console.log('Months chart data refresh!')
  })
})

// refresh years scope once a day
cron.schedule('0 0 * * *', function () {
  refreshChartData('days').then(() => {
    console.log('Months chart data refresh!')
  })
})
