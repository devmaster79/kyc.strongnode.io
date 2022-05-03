import { getResponseData, setToken } from './utils'
import * as urls from '../../utils/config'
import {
  BannedError,
  GenericResponse,
  Success,
  UnauthorizedError,
  UnexpectedError,
  ValidationError
} from './responses'

type AuthByAuthenticatorRequest = { token: string }
type AuthByAuthenticatorResponse =
  | (Success & { token: string })
  | UnexpectedError
  | UnauthorizedError
  | BannedError
  | ValidationError<'token', undefined>
  | ValidationError<'token', 'wrong'>
/** Verify OTP and set token */
export async function authByAuthenticator(otp: string) {
  const data = await getResponseData<
    AuthByAuthenticatorRequest,
    AuthByAuthenticatorResponse
  >(urls.authByAuthenticator, { token: otp })
  if (data.result === 'success') {
    setToken(data.token)
  }
  return data
}

type GenerateAuthenticatorQRCodeRequest = Record<never, never>
type GenerateAuthenticatorQRCodeResponse =
  | { result: 'success'; qrcode: string }
  | UnauthorizedError
  | UnexpectedError
export async function generateAuthenticatorQRCode() {
  return await getResponseData<
    GenerateAuthenticatorQRCodeRequest,
    GenerateAuthenticatorQRCodeResponse
  >(urls.generateAuthenticatorQRCode)
}

type EnableAuthenticatorAuthRequest = { token: string }
type EnableAuthenticatorAuthResponse =
  | GenericResponse
  | ValidationError<'token', undefined>
  | ValidationError<'token', 'wrong'>
export async function enableAuthenticatorAuth(token: string) {
  return await getResponseData<
    EnableAuthenticatorAuthRequest,
    EnableAuthenticatorAuthResponse
  >(urls.enableAuthenticatorAuth, { token })
}

type DisableAuthenticatorAuthRequest = Record<never, never>
type DisableAuthenticatorAuthResponse = GenericResponse
export async function disableAuthenticatorAuth() {
  return await getResponseData<
    DisableAuthenticatorAuthRequest,
    DisableAuthenticatorAuthResponse
  >(urls.disableAuthenticatorAuth)
}
