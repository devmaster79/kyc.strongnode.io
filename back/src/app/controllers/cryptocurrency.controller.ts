import {
  CryptocurrencyDataService,
  isScope,
  scopeDays,
  tokensMetricsListIDs
} from '../services/cryptocurrency/CryptocurrencyDataService'
import CoinGeckoApi from 'coingecko-api'
import {
  StrongnodeCoinData as coinChartData,
  CoinMetricsData as coinMetricsData
} from '../models'
import {
  GetTokenChartData,
  GetTokensMetrics,
  RefreshStrongnodeTokenData,
  RefreshTokenDataList
} from 'shared/endpoints/cryptocurrency'
import { success, zodValidationError } from 'shared/endpoints/responses'
import { withResponse } from './utils'
const cryptocurrencyDataService = new CryptocurrencyDataService(
  new CoinGeckoApi()
)

/**
 * Method that is used for refreshing data for SNE token from Coingecko.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const refreshStrongnodeTokenData =
  withResponse<RefreshStrongnodeTokenData.Response>(async (req) => {
    const data = RefreshStrongnodeTokenData.schema.parse(req.body)
    if (!isScope(data.scope))
      return zodValidationError([
        {
          code: 'custom',
          path: ['scope'],
          message:
            'Scope parameter is unsupported. Supported scopes: "days", "weeks", "months" and "years."'
        }
      ])

    const chartData = await cryptocurrencyDataService.getTokenChartData(
      scopeDays[data.scope]
    )
    const token = 'strongnode'
    const checkScopedRecord = await coinChartData.findOne({
      where: { scope: data.scope, token }
    })

    if (!checkScopedRecord)
      await coinChartData.create({
        data: chartData,
        token: token,
        scope: data.scope
      })
    else
      await coinChartData.update(
        { data: chartData, scope: data.scope },
        { where: { scope: data.scope, token: token } }
      )

    return success({ message: 'succesfully refreshed' })
  })

/**
 * Method that is used for refreshing data for a specified crypto tokens.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const refreshTokenDataList = withResponse<RefreshTokenDataList.Response>(
  async () => {
    const data = await cryptocurrencyDataService.getTokenPrice(
      tokensMetricsListIDs
    )

    // save or update each of this token data
    if (data) {
      for (const el of Object.keys(data)) {
        const tokenUpdate = await coinMetricsData.update(
          {
            usd_value: Number(data[el].usd).toFixed(30),
            market_cap: Number(data[el].usd_market_cap).toFixed(30),
            day_volume: Number(data[el].usd_24h_vol).toFixed(30),
            day_change: Number(data[el].usd_24h_change).toFixed(30)
          },
          { where: { token: el } }
        )

        if (!tokenUpdate[0]) {
          const tokenDetails = await cryptocurrencyDataService.getTokenDetails(
            el
          )

          await coinMetricsData.create({
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

    return success({
      message: 'Successfully updated.'
    })
  }
)

/**
 * Method that is used for getting token data for the client.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getTokenChartData = withResponse<GetTokenChartData.Response>(
  async (req) => {
    const data = GetTokenChartData.schema.parse(req.query)
    if (!isScope(data.scope))
      return zodValidationError([
        {
          code: 'custom',
          path: ['scope'],
          message:
            'Scope parameter is unsupported. Supported scopes: "days", "weeks", "months" and "years."'
        }
      ])

    const tokenData = await coinChartData.findOne({
      where: { token: data.token, scope: data.scope }
    })

    if (tokenData) return success({ data: tokenData.data })
    else throw new Error('Token data were not found.')
  }
)

/**
 *  Method that returns all of the token metrics data.
 */
export const getTokensMetrics = withResponse<GetTokensMetrics.Response>(
  async () => {
    // todo add query option to get only one token
    const tokenMetrics = await coinMetricsData.findAll()
    return success({ tokenMetrics })
  }
)
