import { getResponseData, setToken } from './utils'
import * as urls from '../../utils/config'
import {
  BannedError,
  GenericResponse,
  UnauthorizedError,
  UnexpectedError,
  ValidationError
} from './responses'

/**
 * Verify OTP and set token
 */
export async function authByAuthenticator (
  otp: string
): Promise<
  | GenericResponse
  | BannedError
  | ValidationError<'token', undefined>
  | ValidationError<'token', 'wrong'>
> {
  const data = await getResponseData(urls.authByAuthenticator, { token: otp })
  if (data.token) {
    setToken(data.token)
  }
  return data
}

export async function generateAuthenticatorQRCode (): Promise<
  { result: 'success'; qrcode: string } | UnauthorizedError | UnexpectedError
  > {
  return await getResponseData(urls.generateAuthenticatorQRCode)
}

export async function enableAuthenticatorAuth (
  token: string
): Promise<
  | GenericResponse
  | ValidationError<'token', undefined>
  | ValidationError<'token', 'wrong'>
> {
  return await getResponseData(urls.enableAuthenticatorAuth, { token })
}

export async function disableAuthenticatorAuth (): Promise<GenericResponse> {
  return await getResponseData(urls.disableAuthenticatorAuth)
}
