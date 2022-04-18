/**
 * Token ids for metrics table.
 * @type {string[]}
 */
const tokensMetricsListIDs = ['strongnode', 'bitcoin', 'ethereum', 'matic-network']

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

  /**
   * Method for getting token price.
   * @param tokens
   * @param vsCurrency
   * @returns {Promise<void>}
   */
  async getTokenPrice (tokens = 'strongnode', vsCurrency = 'usd') {
    const result = await this.__coingeckoClient.simple.price({
      ids: tokens,
      vs_currencies: vsCurrency,
      include_24hr_vol: true,
      include_last_updated_at: true,
      include_24hr_change: true,
      include_market_cap: true
    })

    if (result)
      return result.data
    else
      return 'error' // todo error
  }

  /**
   * Method that returns token details.
   * @param tokenId
   * @returns {Promise<{code: number, data: (Object|*), message: string, success: boolean}>}
   */
  async getTokenDetails (tokenId) {
    const result = await this.__coingeckoClient.coins.fetch(tokenId);
    return result
  }
}

module.exports = {
  CryptocurrencyDataService,
  availableScopes,
  tokensMetricsListIDs,
  scopeDays
}
