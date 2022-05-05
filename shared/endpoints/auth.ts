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

if (typeof window !== 'undefined') {
  // This stops leaking backend validation rules, but it gives us the possibility
  // to infer the validation types for frontend and backend at the same time.
  //
  // NOTE: TS will remove normal imports as well that imports only type.
  // So you can use both `import` and `import type`.
  // But if you see this message it means you import
  // something that you really should not.
  alert('THE FRONTEND SHOULD ONLY IMPORT THIS FILE AS TYPE (use import type)')
}

export namespace SendVerificationEmail {
  export const schema = z.object({
    email: z.string().email()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{}>
    | ZodValidationError<Request['body']>
    | UnexpectedError
}

export namespace Register {
  export const schema = z.object({
    user_name: z
      .string()
      .min(3, { message: 'Username should be at least 3 characters' })
      .regex(/^[a-z\-_]+$/g, {
        message:
          'Username should only contain lowercase letters including hypen (-) and underscore (_)'
      }),
    first_name: z.string(),
    last_name: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ token: string }>
    | ApiResponse<'limit-reached-error', 403, Record<never, never>>
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
    | Success<{}>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace DisablePasswordAuth {
  export type Request = { body: undefined }
  export type Response = Success<{}> | UnauthorizedError | UnexpectedError
}

export namespace AuthByPassword {
  export const schema = z.object({
    password: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ token: string }>
    | BannedError
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace SendSMSToUser {
  export type Request = { body: undefined }
  export type Response =
    | Success<{}>
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
    | Success<{ token: string }>
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
    | Success<{}>
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
    | Success<{}>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace DisableSMSAuth {
  export type Request = { body: undefined }
  export type Response = Success<{}> | UnauthorizedError | UnexpectedError
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
    | Success<{ token: string }>
    | BannedError
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace GenerateAuthenticatorQRCode {
  export type Request = { body: undefined }
  export type Response =
    | Success<{ qrcode: string; secret: string }>
    | UnauthorizedError
    | UnexpectedError
}

export namespace EnableAuthenticatorAuth {
  export const schema = z.object({
    token: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{}>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace DisableAuthenticatorAuth {
  export type Request = { body: undefined }
  export type Response = Success<{}> | UnauthorizedError | UnexpectedError
}
