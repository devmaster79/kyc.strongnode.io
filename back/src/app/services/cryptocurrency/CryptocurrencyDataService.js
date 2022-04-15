/**
 * Token ids for metrics table.
 * @type {string[]}
 */
const tokensMetricsListIDs = ['strongnode', 'bitcoin', 'ether', 'matic']

/**
 * Scopes for Charts.
 * @type {string[]}
 */
const availableScopes = ['days', 'weeks', 'months', 'years']

/**
 * Number of days for each scope definition.
 * @type {{weeks: number, months: number, days: number, years: number}}
 */
const scopeDays = {
  days: 7,
  weeks: 30,
  months: 365,
  years: 1095
}

/**
 * Cryptocurrency data service that takes care of getting data from coingecko api.
 */
class CryptocurrencyDataService {

  /**
   * @param {typeof import('coingecko-api')} coingeckoClient
   */
  constructor(coingeckoClient) {
    this.__coingeckoClient = new coingeckoClient()
  }

  async getTokenChartData (days = 7, vsCurrency = 'usd', tokenId = 'strongnode') {
    const result = await this.__coingeckoClient.coins.fetchMarketChart(tokenId, {vs_currency: vsCurrency, days: days.toString()})
    if (result)
      return result.data

    else
      return 'error' // todo error
  }

  async getTokenPrice (tokens = 'strongnode', vsCurrency = 'usd') {
    // todo
  }
}

module.exports = {
  CryptocurrencyDataService,
  availableScopes,
  tokensMetricsListIDs,
  scopeDays
}
