const axios = require('axios')
// let the script updates production and stage envs
const baseUrls = [
  // localhost url
  // 'http://192.168.0.107:8080',
  'https://stage.strongonde.io',
  'https://id.strongnode.io'
]

const url = '/api/cryptocurrency/refresh-tokens'

/**
 * This should be called every 10 seconds.
 * @returns {Promise<void>}
 */
const refreshChartData = async () => {
  for (let i = 0; i < baseUrls.length; i++) {
    await axios
      .get(baseUrls[i] + url)
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

exports.handler = refreshChartData()
