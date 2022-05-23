/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */

import '../utils/frontend-should-only-import-types-guard'
import { z } from 'zod'
import {
  ApiResponse,
  NotFoundError,
  Success,
  UnauthorizedError,
  UnexpectedError,
  ZodValidationError
} from './responses'
import { userNameRule } from './common'

export namespace CreateInvestor {
  export const schema = z.object({
    investor_name: z.string().min(3),
    investor_telegram_id: z
      .string()
      .regex(/^@/, 'Id should start with the "@" character')
      .min(3),
    investor_country: z.string(),
    investor_commitment_amount: z.string(),
    investor_wallet_address: z.string(),
    investor_fund_name: z.string(),
    investor_fund_website: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string; status: 'created' }>
    | ApiResponse<
        'investor-is-already-registered-error',
        400,
        { message: string }
      >
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace GetInvestorDetails {
  export type Request = { body: undefined }
  export type InvestorDetail = {
    investor_name: string
    investor_email: string
    investor_telegram_id: string
    investor_country: string
    investor_commitment_amount: string
    investor_wallet_address: string
    investor_fund_name: string
    investor_fund_website: string
  }
  export type Response =
    | Success<{ data: InvestorDetail }>
    | NotFoundError<{}>
    | UnauthorizedError
    | UnexpectedError
}

export namespace GetProfile {
  export type Request = { body: undefined }
  export type Profile = {
    email: string
    user_name: string
    first_name: string
    last_name: string
    enable_authenticator: boolean
    enable_sms: boolean
    enable_password: boolean
  }
  export type Response =
    | Success<{ data: Profile }>
    | UnauthorizedError
    | UnexpectedError
}

export namespace UpdateProfile {
  export const schema = z.object({
    email: z.string().email().optional(),
    user_name: userNameRule.optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    enable_authenticator: z.boolean().optional(),
    enable_sms: z.boolean().optional(),
    enable_password: z.boolean().optional()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ApiResponse<
        'email-and-username-are-not-updateable-error',
        400,
        { message: string }
      >
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace CreateSupportRequest {
  export const schema = z.object({
    subject: z.string(),
    message: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace AddOrUpdateWallet {
  export const schema = z.object({
    wallet: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
}

export namespace GetUserWallets {
  export type Request = { body: undefined }
  export type Response =
    | Success<{ email: string; wallets: string[] }>
    | UnauthorizedError
    | UnexpectedError
}
