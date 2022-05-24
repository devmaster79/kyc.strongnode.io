import { fetchAPI } from '../utils'
import * as urls from '../../utils/config'
import {
  EnablePasswordAuth,
  DisablePasswordAuth,
  AuthByPassword
} from 'shared/endpoints/auth'
import { setToken } from './tokenService'

export async function enablePasswordAuth(password: string) {
  return await fetchAPI<
    EnablePasswordAuth.Request,
    EnablePasswordAuth.Response
  >('post', urls.enablePasswordAuth, { password })
}

export async function disablePasswordAuth() {
  return await fetchAPI<
    DisablePasswordAuth.Request,
    DisablePasswordAuth.Response
  >('post', urls.disablePasswordAuth)
}

/** Verify password and set token */
export async function authByPassword(password: string) {
  const data = await fetchAPI<AuthByPassword.Request, AuthByPassword.Response>(
    'post',
    urls.authByPassword,
    { password }
  )
  if (data.result === 'success') {
    setToken(data.token)
  }
  return data
}
