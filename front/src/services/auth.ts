import { generateApiCalls, Response } from './utils'
import * as authEndpoints from 'shared/endpoints/auth'
import axios from 'axios'

const rawCalls = generateApiCalls(authEndpoints)

/** HOF for setting token if the the result is success so the token is given */
function withSettingToken<
  TResponse extends { result: string; token?: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TCall extends (...args: any[]) => Response<TResponse>
>(apiCall: TCall) {
  return async (
    ...args: Parameters<TCall>
  ): Promise<Awaited<ReturnType<TCall>>> => {
    const data = await apiCall(...args)
    if (data.result === 'success' && data.token) {
      setToken(data.token)
    }
    return data as unknown as Awaited<ReturnType<TCall>>
  }
}

const signOut = () => {
  localStorage.clear()
  setToken(null)
}

function setToken(token: string | null) {
  if (token === null) {
    localStorage.removeItem('token')
  } else {
    localStorage.setItem('token', token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}

const authService = {
  /* automatically generated API calls */
  ...rawCalls,

  /* overwritten API calls */
  register: withSettingToken(rawCalls.register),
  authByAuthenticator: withSettingToken(rawCalls.authByAuthenticator),
  authByPassword: withSettingToken(rawCalls.authByPassword),
  authBySMSCode: withSettingToken(rawCalls.authBySMSCode),

  /* utils */
  setToken,
  signOut
}

export default authService
