/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */
import { z } from 'zod'

export namespace UploadIdentityPhoto {
  export const METHOD = 'post'
  export const PATH = '/api/kyc/id-photo'
  export const schema = z.object({
    file: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response = {
    result:
      | 'verifyingQuality'
      | 'saving'
      | 'qualityVerificationFailed'
      | 'success'
      | 'unexpected-error' // TODO: change to camelCase
      | 'validation-error' // TODO: change to camelCase
    message: string
  }
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace UploadUserWithIdentityPhoto {
  export const METHOD = 'post'
  export const PATH = '/api/kyc/user-with-id-photo'
  export const schema = z.object({
    file: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response = {
    result:
      | 'verifyingQuality'
      | 'saving'
      | 'qualityVerificationFailed'
      | 'success'
      | 'unexpected-error' // TODO: change to camelCase
      | 'validation-error' // TODO: change to camelCase
    message: string
  }
  export const request: Request | null = null
  export const response: Response | null = null
}

export namespace VerifyIdentity {
  export const METHOD = 'post'
  export const PATH = '/api/kyc/verify-identity'
  export const schema = z.object({
    /** YYYY-MM-DD */
    birthday: z.string(),
    firstName: z.string(),
    lastName: z.string()
  })
  export type Request = { body: z.infer<typeof schema> }
  export type Response = {
    result:
      | 'facesDidNotMatch'
      | 'matchingFaces'
      | 'matchingText'
      | 'fetchingPhotos'
      | 'missingRequiredPhotos'
      | 'saving'
      | 'unableToFindRequiredTextOnPhoto'
      | 'success'
      | 'unexpected-error' // TODO: change to camelCase
      | 'validation-error' // TODO: change to camelCase
    message: string
  }
  export const request: Request | null = null
  export const response: Response | null = null
}
