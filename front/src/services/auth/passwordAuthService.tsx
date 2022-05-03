import { getResponseData, setToken } from './utils'
import * as urls from '../../utils/config'
import {
  EnablePasswordAuth,
  DisablePasswordAuth,
  AuthByPassword
} from 'shared/endpoints/auth'

export async function enablePasswordAuth(password: string) {
  return await getResponseData<
    EnablePasswordAuth.Request,
    EnablePasswordAuth.Response
  >(urls.enablePasswordAuth, { password })
}

export async function disablePasswordAuth() {
  return await getResponseData<
    DisablePasswordAuth.Request,
    DisablePasswordAuth.Response
  >(urls.disablePasswordAuth)
}

/** Verify password and set token */
export async function authByPassword(password: string) {
  const data = await getResponseData<
    AuthByPassword.Request,
    AuthByPassword.Response
  >(urls.authByPassword, { password })
  if (data.result === 'success') {
    setToken(data.token)
  }
  return data
}
