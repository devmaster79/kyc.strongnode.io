/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */

import '../utils/frontend-should-only-import-types-guard'
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
  export const schema = z.object({
    email: z.string().email()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnexpectedError
}

export namespace Register {
  export const schema = z.object({
    user_name: userNameRule,
    first_name: z.string(),
    last_name: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string; token: string }>
    | ApiResponse<'limit-reached-error', 403, { message: string }>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace EnablePasswordAuth {
  export const schema = z.object({
    password: z.string().min(6)
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace DisablePasswordAuth {
  export type Request = { body: undefined }
  export type Response =
    | Success<{ message: string }>
    | UnauthorizedError
    | UnexpectedError
}

export namespace AuthByPassword {
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
}

export namespace SendSMSToUser {
  export type Request = { body: undefined }
  export type Response =
    | Success<{ message: string }>
    | BannedError
    | UnauthorizedError
    | UnexpectedError
}

export namespace AuthBySMSCode {
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
}

export namespace SendSMSAndSaveNumber {
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
}

export namespace EnableSMSAuth {
  export const schema = z.object({
    smscode: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace DisableSMSAuth {
  export type Request = { body: undefined }
  export type Response =
    | Success<{ message: string }>
    | UnauthorizedError
    | UnexpectedError
}

export namespace AuthByAuthenticator {
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
}

export namespace GenerateAuthenticatorQRCode {
  export type Request = { body: undefined }
  export type Response =
    | Success<{ message: string; qrcode: string; secret: string }>
    | UnauthorizedError
    | UnexpectedError
}

export namespace EnableAuthenticatorAuth {
  export const schema = z.object({
    token: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace DisableAuthenticatorAuth {
  export type Request = { body: undefined }
  export type Response =
    | Success<{ message: string }>
    | UnauthorizedError
    | UnexpectedError
}
