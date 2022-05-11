const axios = require('axios')
// let the script updates production and stage envs
const baseUrls = ['https://stage.strongonde.io', 'https://id.strongnode.io']

const url = '/api/cryptocurrency/refresh-strongnode-token?scope='

/**
 * This should be called every 5 minutes, since the Coingecko data granuality is 5 minutes for the days interval.
 * @returns {Promise<void>}
 */
const refreshChartData = async (event) => {
  for (let i = 0; i < baseUrls.length; i++) {
    await axios
      .get(baseUrls[i] + url + event.scope)
      .then((response) => {
        return response.data
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

exports.handler = refreshChartData()
