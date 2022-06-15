import { generateApiCalls } from './utils'
import * as cryptoEndpoints from 'shared/endpoints/cryptocurrency'

export type IGetTokenMetricsObject =
  cryptoEndpoints.GetTokensMetrics.IGetTokenMetricsObject
export type IGetTokenMetricsImageObject =
  cryptoEndpoints.GetTokensMetrics.IGetTokenMetricsImageObject

const cryptoDataService = generateApiCalls(cryptoEndpoints)
export default cryptoDataService
