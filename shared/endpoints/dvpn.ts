/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */

import {
  NotFoundError,
  Success,
  UnauthorizedError,
  UnexpectedError
} from './responses'
import { z } from 'zod'

export namespace HasAccess {
  export const METHOD = 'get'
  export const PATH = '/api/dvpn/access'
  export type Request = {}
  export type Access = {
    dvpnAccess: boolean
  }
  export type Response =
    | Success<Access>
    | NotFoundError<{}>
    | UnauthorizedError
    | UnexpectedError
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace VerifyAccount {
  export const METHOD = 'post'
  export const PATH = '/api/dvpn/verify'
  export const schema = z.object({
    email: z.string(),
    password: z.string()
  })
  export type Request = { body: z.input<typeof schema> }
  export type AccountDetail = {
    dvpnAccess: boolean
    token?: string
    message?: string
  }
  export type Response =
    | Success<AccountDetail>
    | NotFoundError<{}>
    | UnauthorizedError
    | UnexpectedError
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace GenerateAccount {
  export const METHOD = 'put'
  export const PATH = '/api/dvpn/access'
  export type Request = {}
  export type AccountDetail = {
    id: number
    password: string
    access: boolean
    createdAt: Date
    updatedAt: Date
    generatedPassword?: string
  }
  export type Response =
    | Success<AccountDetail>
    | NotFoundError<{}>
    | UnauthorizedError
    | UnexpectedError
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace GetUsageData {
  export const METHOD = 'get'
  export const PATH = '/api/dvpn/usage'

  export interface UsageData {
    id: number
    bytesIn: number
    bytesOut: number
    createdAt: Date
  }

  export type Request = void
  export type Response =
    | Success<{ data: UsageData[] }>
    | UnauthorizedError
    | UnexpectedError
    | NotFoundError<{}>

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace SaveUsageData {
  export const METHOD = 'post'
  export const PATH = '/api/dvpn/usage'

  export const schema = z.object({
    bytesIn: z.number(),
    bytesOut: z.number()
  })

  export interface UsageData {
    bytesIn: number
    bytesOut: number
    createdAt: Date
  }

  export type Request = {
    params: z.input<typeof schema>
  }

  export type Response =
    | Success<{ data: UsageData }>
    | UnauthorizedError
    | UnexpectedError
    | NotFoundError<{}>

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace CancelAccess {
  export const METHOD = 'delete'
  export const PATH = '/api/dvpn/access'
  export type Request = {}
  export type Canceled = {
    canceled: boolean
  }
  export type Response =
    | Success<Canceled>
    | NotFoundError<{}>
    | UnauthorizedError
    | UnexpectedError
  export const request: Request | null = null
  export const response: Response | null = null
}
