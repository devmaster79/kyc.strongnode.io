import { isScope } from '../services/cryptocurrency/CryptocurrencyDataService'
import {
  StrongnodeCoinData as coinChartData,
  CoinMetricsData as coinMetricsData
} from '../models'
import {
  GetTokenChartData,
  GetTokensMetrics
} from 'shared/endpoints/cryptocurrency'
import { success, zodValidationError } from 'shared/endpoints/responses'
import { withResponse } from './utils'
const { Op } = require('sequelize')

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
      where: { symbol: data.token, scope: data.scope }
    })

    if (tokenData) return success({ data: tokenData.data })
    else throw new Error('Token data were not found.')
  }
)

/**
 *  Method that returns all of the token metrics data.
 */
export const getTokensMetrics = withResponse<GetTokensMetrics.Response>(
  async (req) => {
    const data = GetTokensMetrics.schema.parse(req.query)
    const tokenMetrics = await coinMetricsData.findAll({
      where: {
        token: { [Op.substring]: data.search }
      },
      offset: 0,
      limit: parseInt(data.page) * parseInt(data.perPage)
    })

    const total = await coinMetricsData.count()

    return success({ tokenMetrics: tokenMetrics, total: total })
  }
)
