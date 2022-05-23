import * as urls from '../../utils/config'
import {
  AuthByAuthenticator,
  EnableAuthenticatorAuth,
  GenerateAuthenticatorQRCode,
  DisableAuthenticatorAuth
} from 'shared/endpoints/auth'
import { fetchAPI } from 'services/utils'
import { setToken } from './tokenService'

/** Verify OTP and set token */
export async function authByAuthenticator(otp: string) {
  const data = await fetchAPI<
    AuthByAuthenticator.Request,
    AuthByAuthenticator.Response
  >('post', urls.authByAuthenticator, { token: otp })
  if (data.result === 'success') {
    setToken(data.token)
  }
  return data
}

export async function generateAuthenticatorQRCode() {
  return await fetchAPI<
    GenerateAuthenticatorQRCode.Request,
    GenerateAuthenticatorQRCode.Response
  >('post', urls.generateAuthenticatorQRCode)
}

export async function enableAuthenticatorAuth(token: string) {
  return await fetchAPI<
    EnableAuthenticatorAuth.Request,
    EnableAuthenticatorAuth.Response
  >('post', urls.enableAuthenticatorAuth, { token })
}

export async function disableAuthenticatorAuth() {
  return await fetchAPI<
    DisableAuthenticatorAuth.Request,
    DisableAuthenticatorAuth.Response
  >('post', urls.disableAuthenticatorAuth)
}
