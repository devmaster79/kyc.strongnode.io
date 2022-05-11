import axios from 'axios'
import { getCryptoChartData, getTokenMetrics } from '../utils/config'

export interface IGetTokenMetricsData {
  [key:string]: object | string | number,
  data: Array<IGetTokenMetricsObject>
}

export interface IGetTokenMetricsObject {
  id: number,
  image: IGetTokenMetricsImageObject,
  day_change: string,
  market_cap: string,
  token: string,
  usd_value: string,
  updatedAt: string,
  createdAt: string
}

export interface IGetTokenMetricsImageObject {
  large: string,
  small: string,
  thumb: string
}

export default {
  async getChartDataAsync (scope = 'days') {
    const url = getCryptoChartData + '?scope=' + scope
    return await axios.get(url)
  },
  async getTokenMetrics () {
    // todo add the parameter to call only data for one token
    return await axios.get(getTokenMetrics)
  }
}
