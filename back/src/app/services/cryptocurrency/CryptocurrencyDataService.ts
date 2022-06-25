import type CoinGeckoApi from 'coingecko-api'
import { CoinMetricsData } from '../../models'

/**
 * Token ids for metrics table.
 * @type {string[]}
 */
export const tokensMetricsListIDs = [
  'strongnode',
  'bitcoin',
  'ethereum',
  'matic-network'
]

/**
 * Number of days for each scope definition.
 * @type {{weeks: number, months: number, days: number, years: number}}
 */
export const scopeDays = {
  days: 7,
  weeks: 30,
  months: 365,
  years: 1095
}

/** Typesafe validation for scopeDays' keys */
export const isScope = (val: string): val is keyof typeof scopeDays =>
  Object.keys(scopeDays).includes(val)

/**
 * Cryptocurrency data service that takes care of getting data from coingecko api.
 */
export class CryptocurrencyDataService {
  constructor(
    private __coingeckoClient: CoinGeckoApi,
    private __coinMetricsData: typeof CoinMetricsData
  ) {}

  /**
   * @throws something, check 'coingecko-api'
   */
  async getTokenChartData(
    days = 7,
    vsCurrency = 'usd',
    tokenId = 'strongnode'
  ) {
    const result = await this.__coingeckoClient.coins.fetchMarketChart(
      tokenId,
      { vs_currency: vsCurrency, days: days.toString() }
    )
    return result.data
  }

  /**
   * Method for getting token price.
   * @param tokens
   * @param vsCurrency
   * @throws something, check 'coingecko-api'
   * @returns {Promise<void>}
   */
  async getTokenPrice(tokens = ['strongnode'], vsCurrency = 'usd') {
    let result = null

    if (tokens.length > 1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = await this.__coingeckoClient.coins.markets()
    } else {
      result = await this.__coingeckoClient.simple.price({
        ids: tokens,
        vs_currencies: vsCurrency,
        include_24hr_vol: true,
        include_last_updated_at: true,
        include_24hr_change: true,
        include_market_cap: true
      })
    }
    return result.data
  }

  /**
   * Method that returns token details.
   * @param tokenId
   * @returns {Promise<{code: number, data: (Object|*), message: string, success: boolean}>}
   */
  async getTokenDetails(tokenId: string) {
    return await this.__coingeckoClient.coins.fetch(tokenId, {})
  }

  async getTokenSymbol(tokenId: string) {
    const result = await this.__coinMetricsData.findOne({
      where: { token: tokenId }
    })

    return result ? result.symbol : false
  }

  /**
   * Method that refreshes token list info and saves to DB.
   */
  async refreshTokenList() {
    const data = await this.getTokenPrice(tokensMetricsListIDs)

    // save or update each of this token data
    if (data) {
      for (const el of Object.keys(data)) {
        const tokenUpdate = await this.__coinMetricsData.update(
          {
            usd_value: Number(data[el].usd).toFixed(30),
            market_cap: Number(data[el].usd_market_cap).toFixed(30),
            day_volume: Number(data[el].usd_24h_vol).toFixed(30),
            day_change: Number(data[el].usd_24h_change).toFixed(30)
          },
          { where: { token: el } }
        )

        if (!tokenUpdate[0]) {
          const tokenDetails = await this.getTokenDetails(el)

          await this.__coinMetricsData.create({
            token: el,
            usd_value: Number(data[el].usd).toFixed(30),
            market_cap: Number(data[el].usd_market_cap).toFixed(30),
            day_volume: Number(data[el].usd_24h_vol).toFixed(30),
            day_change: Number(data[el].usd_24h_change).toFixed(30),
            image: tokenDetails.data.image
          })
        }
      }
    }

    return result ? result.symbol : false
  }
}
