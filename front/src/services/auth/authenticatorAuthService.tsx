import { getResponseData, setToken } from './utils'
import * as urls from '../../utils/config'
import {
  AuthByAuthenticator,
  EnableAuthenticatorAuth,
  GenerateAuthenticatorQRCode,
  DisableAuthenticatorAuth
} from 'shared/endpoints/auth'

/** Verify OTP and set token */
export async function authByAuthenticator(otp: string) {
  const data = await getResponseData<
    AuthByAuthenticator.Request,
    AuthByAuthenticator.Response
  >(urls.authByAuthenticator, { token: otp })
  if (data.result === 'success') {
    setToken(data.token)
  }
  return data
}

export async function generateAuthenticatorQRCode() {
  return await getResponseData<
    GenerateAuthenticatorQRCode.Request,
    GenerateAuthenticatorQRCode.Response
  >(urls.generateAuthenticatorQRCode)
}

export async function enableAuthenticatorAuth(token: string) {
  return await getResponseData<
    EnableAuthenticatorAuth.Request,
    EnableAuthenticatorAuth.Response
  >(urls.enableAuthenticatorAuth, { token })
}

export async function disableAuthenticatorAuth() {
  return await getResponseData<
    DisableAuthenticatorAuth.Request,
    DisableAuthenticatorAuth.Response
  >(urls.disableAuthenticatorAuth)
}
