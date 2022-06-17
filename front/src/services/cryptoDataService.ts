import axios, { AxiosResponse } from 'axios'
import { getCryptoChartData, getTokenMetrics } from '../utils/config'

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
  updatedAt: string
  createdAt: string
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

const getChartDataAsync = (
  scope = 'days'
): Promise<AxiosResponse<IGetChartData>> => {
  const url: string = getCryptoChartData + '?scope=' + scope
  return axios.get(url)
}

const getTokenMetricsFunc = (): Promise<
  AxiosResponse<Array<IGetTokenMetricsObject>>
> => {
  return axios.get(getTokenMetrics)
}

const logger = {
  getChartDataAsync,
  getTokenMetricsFunc
}

export default logger
