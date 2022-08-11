/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */

import {
  ChecksumMismatchError,
  NotFoundError,
  Success,
  UnauthorizedError,
  UnexpectedError
} from './responses'
import z from 'zod'

/** What should the admin verify */
export enum VerificationSubject {
  Identity = 'Identity',
  Address = 'Address',
  BillingAddress = 'BillingAddress',
  TaxIdentificationNumber = 'TaxIdentificationNumber'
}

/** What should the admin verify */
export type VerificationAiResult =
  | null
  | {
      type: 'generic'
      verified: boolean
      message: string
    }
  | {
      type: 'duplicatesFound'
      verified: false
      message: string
      userIds: number[]
    }

/**
 * For id, passport, driving license
 */
export interface IdentityVerification {
  name: VerificationSubject.Identity
  aiResult: VerificationAiResult
  firstName: string
  lastName: string
  /** timestamp */
  birthday: number
  images: {
    /** data:image/jpeg;base64,... */
    idImage: string
    /** data:image/jpeg;base64,... */
    userWithIdImage: string
  }
}

export namespace ListVerificationRequests {
  export const METHOD = 'get'
  export const PATH = '/api/kycadmin/verificationRequests'

  export interface ShortVerificationRequest extends Record<string, unknown> {
    id: number
    username: string
    subject: VerificationSubject
    createdAt: number
  }
  export type Request = void
  export type Response =
    | Success<{ requests: ShortVerificationRequest[] }>
    | UnexpectedError
    | UnauthorizedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export interface VerificationRequest {
  id: number
  username: string
  subject: IdentityVerification // TODO: extend with AddressVerification | BillingAdressVerification ...
  createdAt: number
}

export namespace GetVerificationRequest {
  export const METHOD = 'get'
  export const PARAMS = { requestId: ':requestId' }
  export const PATH = (params: typeof PARAMS) =>
    `/api/kycadmin/verificationRequests/${params.requestId}`
  export type Request = { params: typeof PARAMS }
  export type Response =
    | Success<{ request: VerificationRequest; checksum: string }>
    | NotFoundError<{}>
    | UnexpectedError
    | UnauthorizedError

  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace ApproveVerificationRequest {
  export const schema = z.object({
    checksum: z.string()
  })
  export const METHOD = 'post'
  export const PARAMS = { requestId: ':requestId' }
  export const PATH = (params: typeof PARAMS) =>
    `/api/kycadmin/verificationRequests/${params.requestId}/approve`
  export type Request = {
    params: typeof PARAMS
    body: z.infer<typeof schema>
  }
  export type Response =
    | Success<{ message: string }>
    | ChecksumMismatchError<{
        message: string
        request: VerificationRequest
        checksum: string
      }>
    | NotFoundError<{}>
    | UnexpectedError
    | UnauthorizedError
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace RejectVerificationRequest {
  export const schema = z.object({
    reason: z.string(),
    checksum: z.string()
  })
  export const METHOD = 'post'
  export const PARAMS = { requestId: ':requestId' }
  export const PATH = (params: typeof PARAMS) =>
    `/api/kycadmin/verificationRequests/${params.requestId}/reject`
  export type Request = { params: typeof PARAMS; body: z.infer<typeof schema> }
  export type Response =
    | Success<{ message: string }>
    | ChecksumMismatchError<{
        message: string
        request: VerificationRequest
        checksum: string
      }>
    | NotFoundError<{}>
    | UnexpectedError
    | UnauthorizedError
  export const request: Request | null = null
  export const response: Response | null = null
}
