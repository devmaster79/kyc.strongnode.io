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
  image: string
  dayChange: string
  marketCap: string
  token: string
  usdValue: string
  symbol: string
  updatedAt: Date
  createdAt: Date
}

export interface IGetChartData {
  marketCaps: Array<Array<string>>
  prices: Array<Array<string>>
  total_volumes: Array<Array<string>>
}

const getChartDataAsync = (scope: scopes = 'days', token = 'sne') => {
  return rawCalls.getTokenChartData({ params: { scope: scope, token: token } })
}

const getTokenMetricsFunc = (search = '', page = 1, perPage = 10) => {
  return rawCalls.getTokensMetrics({
    params: {
      search: search,
      page: page.toString(),
      perPage: perPage.toString()
    }
  })
}

const cryptoDataService = {
  getChartDataAsync,
  getTokenMetricsFunc
}

export default cryptoDataService
