/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */

import { z } from 'zod'
import {
  Success,
  UnauthorizedError,
  UnexpectedError,
  ZodValidationError
} from './responses'

export namespace RefreshStrongnodeTokenData {
  export const METHOD = 'patch'
  export const PATH = '/api/cryptocurrency/refresh-strongnode-token'
  export const schema = z.object({
    scope: z.string().regex(/days|weeks|months|years/g)
  })
  export type Request = {
    body: z.infer<typeof schema> & {
      scope: 'days' | 'weeks' | 'months' | 'years'
    }
  }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace RefreshTokenDataList {
  export const METHOD = 'patch'
  export const PATH = '/api/cryptocurrency/refresh-tokens'
  export type Request = void
  export type Response =
    | Success<{ message: string }>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace GetTokenChartData {
  export const METHOD = 'get'
  export const PATH = '/api/cryptocurrency/chart'
  export const schema = z.object({
    scope: z.string().regex(/days|weeks|months|years/g),
    token: z.string().default('strongnode')
  })
  export interface CoinMarketData {
    market_caps: number[][]
    prices: number[][]
    total_volumes: number[][]
  }
  export type Request = {
    params: z.input<typeof schema> & {
      scope: 'days' | 'weeks' | 'months' | 'years'
    }
  }
  export type Response =
    | Success<{ data: CoinMarketData }>
    | ZodValidationError<Request['params']>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace GetTokensMetrics {
  export const METHOD = 'get'
  export const PATH = '/api/cryptocurrency/token-metrics'
  export type Request = void
  export interface IGetTokenMetricsObject {
    id: number
    image: IGetTokenMetricsImageObject
    dayChange: string
    marketCap: string
    token: string
    usdValue: string
    updatedAt: Date
    createdAt: Date
  }
  export interface IGetTokenMetricsImageObject {
    large: string
    small: string
    thumb: string
  }
  export type Response =
    | Success<{ tokenMetrics: IGetTokenMetricsObject[] }>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}
