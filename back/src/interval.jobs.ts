import {
  CryptocurrencyDataService,
  scopeDays
} from './app/services/cryptocurrency/CryptocurrencyDataService'
import CoinGeckoApi from 'coingecko-api'
import { CoinMetricsData } from './app/models'
import { AppLogger } from './app/services/Logger'

const SECOND = 1000
const DAY = 86400 * SECOND

/**
 * Helper function for delaying API calls.
 * @param ms
 */
const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const cryptocurrencyDataService = new CryptocurrencyDataService(
  new CoinGeckoApi(),
  CoinMetricsData
)

const refreshChartDataAllTokens = async (scope: keyof typeof scopeDays) => {
  const tokens = await CoinMetricsData.findAll({
    attributes: ['token'],
    group: ['token']
  }).then((tokens) => tokens.map((token) => token.token))

  for (const token in tokens) {
    AppLogger.log(`CHART DATA REFRESH ⚙️ refreshing: ` + tokens[token])
    cryptocurrencyDataService
      .refreshTokenChartData(tokens[token], scope)
      .then((res) => {
        AppLogger.log('CHART DATA REFRESH ✅ result: ' + res.message)
      })
      .catch((err) => {
        AppLogger.log('CHART DATA REFRESH ❌')
        AppLogger.log(err)
      })

    await delay(SECOND * 1.2)
  }
  AppLogger.log(`CHART DATA REFRESH ✅️ Done refreshing! scope: ` + scope)
}

/**
 * This set interval takes care of refreshing data for token's metrics.
 * INTERVAL: every 10 seconds
 */
setInterval(() => {
  AppLogger.log(`TOKEN LIST REFRESH ⚙️ 10sec interval`)
  cryptocurrencyDataService
    .refreshTokenDataList()
    .then((res) => {
      AppLogger.log('TOKEN LIST REFRESH ✅ result: ' + res.message)
    })
    .catch((err) => {
      AppLogger.log('TOKEN LIST REFRESH ❌')
      AppLogger.log(err)
    })
}, SECOND * 10)

/**
 * This set interval takes care of refreshing chart data for tokens.
 * INTERVAL: every 5 minutes
 */
setInterval(() => {
  AppLogger.log(`CHART DATA REFRESH ⚙️ 5 minutes interval`)
  refreshChartDataAllTokens('days')
}, SECOND * 60 * 5)

/**
 * This set interval takes care of refreshing chart data for tokens.
 * INTERVAL: every 1 hour
 */
setInterval(() => {
  AppLogger.log(`CHART DATA REFRESH ⚙️ hour interval`)
  refreshChartDataAllTokens('weeks')
}, SECOND * 60 * 60)

/**
 * This set interval takes care of refreshing chart data for tokens.
 * INTERVAL: every day
 */
setInterval(() => {
  AppLogger.log(`CHART DATA REFRESH ⚙️ day interval`)
  refreshChartDataAllTokens('months')
  refreshChartDataAllTokens('years')
}, DAY)
