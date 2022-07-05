import {
  CoinMetricsData,
  StrongnodeCoinData as coinChartData
} from '../../models'

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private __coingeckoClient: any,
    private __coinMetricsData: typeof CoinMetricsData
  ) {}

  /**
   * Method that gets and refreshes token data list.
   */
  async refreshTokenDataList() {
    const data = await this.getTokenPrice(tokensMetricsListIDs)

    // save or update each of this token data
    if (data) {
      for (const el of Object.keys(data)) {
        const tokenUpdate = await this.__coinMetricsData.update(
          {
            usdValue: data[el].current_price,
            marketCap: data[el].market_cap,
            dayVolume: data[el].total_volume,
            dayChange: data[el].price_change_percentage_24h
          },
          { where: { token: data[el].id } }
        )

        if (!tokenUpdate[0]) {
          await this.__coinMetricsData.create({
            token: data[el].id,
            usdValue: data[el].current_price,
            marketCap: data[el].market_cap,
            dayVolume: data[el].total_volume,
            dayChange: data[el].price_change_percentage_24h,
            image: data[el].image,
            symbol: data[el].symbol
          })
        }
      }
    }

    return {
      message: 'Successfully updated.'
    }
  }

  async refreshTokenChartData(
    token = 'strongnode',
    scope: keyof typeof scopeDays = 'days'
  ) {
    const chartData = await this.getTokenChartData(scopeDays[scope])
    const checkScopedRecord = await coinChartData.findOne({
      where: { scope: scope, token }
    })

    const symbol = await this.getTokenSymbol(token)

    if (!checkScopedRecord)
      await coinChartData.create({
        data: chartData,
        token: token,
        scope: scope,
        symbol: symbol ? symbol : ''
      })
    else
      await coinChartData.update(
        { data: chartData, scope: scope },
        { where: { scope: scope, token: token } }
      )

    return { message: 'succesfully refreshed' }
  }

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
}
