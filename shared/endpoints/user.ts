/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */

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
  export const METHOD = 'put'
  export const PATH = '/api/users/createInvestor'
  export const schema = z.object({
    investorName: z.string().min(3),
    investorTelegramId: z
      .string()
      .regex(/^@/, 'Id should start with the "@" character')
      .min(3),
    investorCountry: z.string(),
    investorCommitmentAmount: z.string(),
    investorWalletAddress: z.string(),
    investorFundName: z.string(),
    investorFundWebsite: z.string()
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
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace GetInvestorDetails {
  export const METHOD = 'get'
  export const PATH = '/api/users/profile/getInvestorProfile'
  export type Request = void
  export type InvestorDetail = {
    investorName: string
    investorEmail: string
    investorTelegramId: string
    investorCountry: string
    investorCommitmentAmount: string
    investorWalletAddress: string
    investorFundName: string
    investorFundWebsite: string
  }
  export type Response =
    | Success<{ data: InvestorDetail }>
    | NotFoundError<{}>
    | UnauthorizedError
    | UnexpectedError
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace GetProfile {
  export const METHOD = 'get'
  export const PATH = '/api/users/profile'
  export type Request = void
  export type Profile = {
    email: string
    username: string
    firstName: string
    lastName: string
    enableAuthenticator: boolean
    enableSms: boolean
    enablePassword: boolean
  }
  export type Response =
    | Success<{ data: Profile }>
    | UnauthorizedError
    | UnexpectedError
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace UpdateProfile {
  export const METHOD = 'put'
  export const PATH = '/api/users/profile'
  export const schema = z.object({
    email: z.string().email().optional(),
    username: userNameRule.optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    enableAuthenticator: z.boolean().optional(),
    enableSms: z.boolean().optional(),
    enablePassword: z.boolean().optional()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response =
    | Success<{ body: Required<z.infer<typeof schema>>; message: string }>
    | ApiResponse<
        'email-and-username-are-not-updateable-error',
        400,
        { message: string }
      >
    | ZodValidationError<Request['body']>
    | UnauthorizedError
    | UnexpectedError
    | NotFoundError<{}>
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace CreateSupportRequest {
  export const METHOD = 'post'
  export const PATH = '/api/users/support/create-request'
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
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace AddOrUpdateWallet {
  export const METHOD = 'post'
  export const PATH = '/api/users/wallets'
  export const schema = z.object({
    wallet: z.string()
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

export namespace GetUserWallets {
  export const METHOD = 'get'
  export const PATH = '/api/users/wallets'
  export type Request = void
  export type Response =
    | Success<{ email: string; wallets: string[] }>
    | UnauthorizedError
    | UnexpectedError
  export const request: Request | null = null
  export const response: Response | null = null
}
