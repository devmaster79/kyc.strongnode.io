import axios, { AxiosResponse } from 'axios'
import { getCryptoChartData, getTokenMetrics } from '../utils/config'

export interface IGetTokenMetricsData {
  [key: string]: object | string | number
  data: Array<IGetTokenMetricsObject>
}

export interface IGetTokenMetricsObject {
  id: number
  image: IGetTokenMetricsImageObject
  day_change: string
  market_cap: string
  token: string
  usd_value: string
  updatedAt: string
  createdAt: string
}

export interface IGetTokenMetricsImageObject {
  large: string
  small: string
  thumb: string
}

export interface IGetChartData {
  market_caps: Array<Array<string>>
  prices: Array<Array<string>>
  total_volumes: Array<Array<string>>
}

export default {
  async getChartDataAsync(
    scope = 'days'
  ): Promise<AxiosResponse<IGetChartData>> {
    const url: string = getCryptoChartData + '?scope=' + scope
    return axios.get(url)
  },
  async getTokenMetrics(): Promise<
    AxiosResponse<Array<IGetTokenMetricsObject>>
  > {
    // todo add the parameter to call only data for one token
    return axios.get(getTokenMetrics)
  }
}
