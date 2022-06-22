import * as cryptoEndpoints from 'shared/endpoints/cryptocurrency'
import { generateApiCalls } from './utils'

const rawCalls = generateApiCalls(cryptoEndpoints)

type scopes = 'days' | 'weeks' | 'months' | 'years'

export interface IGetTokenMetricsData {
  [key: string]: object | string | number
  data: Array<IGetTokenMetricsObject>
}

export interface IGetTokenMetricsObject {
  id: number
  image: IGetTokenMetricsImageObject
  dayChange: string
  marketCap: string
  token: string
  usdValue: string
  symbol: string
  updatedAt: Date
  createdAt: Date
}

export interface IGetTokenMetricsImageObject {
  large: string
  small: string
  thumb: string
}

export interface IGetChartData {
  marketCaps: Array<Array<string>>
  prices: Array<Array<string>>
  total_volumes: Array<Array<string>>
}

const getChartDataAsync = (scope: scopes = 'days', token = 'sne') => {
  return rawCalls.getTokenChartData({ params: { scope: scope, token: token } })
}

const getTokenMetricsFunc = () => {
  return rawCalls.getTokensMetrics()
}

const cryptoDataService = {
  getChartDataAsync,
  getTokenMetricsFunc
}

export default cryptoDataService
