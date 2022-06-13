/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */

import { z } from 'zod'
import {
  ApiResponse,
  BannedError,
  Success,
  UnauthorizedError,
  UnexpectedError,
  ZodValidationError
} from './responses'
import { userNameRule } from './common'

export namespace SendVerificationEmail {
  export const METHOD = 'post'
  export const PATH = '/api/auth/sendVerificationEmail'
  export const schema = z.object({
    email: z.string().email()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace Register {
  export const METHOD = 'post'
  export const PATH = '/api/auth/register'
  export const schema = z.object({
    username: userNameRule,
    firstName: z.string(),
    lastName: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string; token: string }>
    | ApiResponse<'limit-reached-error', 403, { message: string }>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace EnablePasswordAuth {
  export const METHOD = 'post'
  export const PATH = '/api/auth/enablePasswordAuth'
  export const schema = z.object({
    password: z.string().min(6)
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace DisablePasswordAuth {
  export const METHOD = 'post'
  export const PATH = '/api/auth/disablePasswordAuth'
  export type Request = void
  export type Response =
    | Success<{ message: string }>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace AuthByPassword {
  export const METHOD = 'post'
  export const PATH = '/api/auth/authByPassword'
  export const schema = z.object({
    password: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string; token: string }>
    | BannedError
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace SendSMSToUser {
  export const METHOD = 'post'
  export const PATH = '/api/auth/sendSMSToUser'
  export type Request = void
  export type Response =
    | Success<{ message: string }>
    | BannedError
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace AuthBySMSCode {
  export const METHOD = 'post'
  export const PATH = '/api/auth/authBySMSCode'
  export const schema = z.object({
    smscode: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string; token: string }>
    | BannedError
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace SendSMSAndSaveNumber {
  export const METHOD = 'post'
  export const PATH = '/api/auth/sendSMSAndSaveNumber'
  export const schema = z.object({
    number: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | BannedError
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace EnableSMSAuth {
  export const METHOD = 'post'
  export const PATH = '/api/auth/enableSMSAuth'
  export const schema = z.object({
    smscode: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace DisableSMSAuth {
  export const METHOD = 'post'
  export const PATH = '/api/auth/disableSMSAuth'
  export type Request = void
  export type Response =
    | Success<{ message: string }>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace AuthByAuthenticator {
  export const METHOD = 'post'
  export const PATH = '/api/auth/authByAuthenticator'
  export const schema = z.object({
    token: z
      .string()
      .length(6, 'The token must be 6 characters')
      .regex(/^[0-9]+$/, 'The token must be a number')
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string; token: string }>
    | BannedError
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace GenerateAuthenticatorQRCode {
  export const METHOD = 'post'
  export const PATH = '/api/auth/generateAuthenticatorQRCode'
  export type Request = void
  export type Response =
    | Success<{ message: string; qrcode: string; secret: string }>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace EnableAuthenticatorAuth {
  export const METHOD = 'post'
  export const PATH = '/api/auth/enableAuthenticatorAuth'
  export const schema = z.object({
    token: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace DisableAuthenticatorAuth {
  export const METHOD = 'post'
  export const PATH = '/api/auth/disableAuthenticatorAuth'
  export type Request = void
  export type Response =
    | Success<{ message: string }>
    | UnauthorizedError
    | UnexpectedError

  export const request: Request | null = null
  export const response: Response | null = null
}
