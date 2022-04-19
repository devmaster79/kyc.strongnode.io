import { getResponseData, setToken } from './utils'
import * as urls from '../../utils/config'
import { BannedError, GenericResponse, Success, UnauthorizedError, UnexpectedError, ValidationError } from './responses'

type EnablePasswordAuthRequest = { password: string }
type EnablePasswordAuthResponse = GenericResponse | ValidationError<'password', undefined>

export async function enablePasswordAuth (password: string) {
  return await getResponseData<
    EnablePasswordAuthRequest,
    EnablePasswordAuthResponse
  >(urls.enablePasswordAuth, { password })
}

type DisablePasswordAuthRequest = Record<never, never>
type DisablePasswordAuthResponse = GenericResponse

export async function disablePasswordAuth () {
  return await getResponseData<
    DisablePasswordAuthRequest,
    DisablePasswordAuthResponse
  >(urls.disablePasswordAuth)
}

type AuthByPasswordRequest = { password: string }
type AuthByPasswordResponse = Success & { token: string }
  | UnexpectedError
  | UnauthorizedError
  | BannedError
  | ValidationError<'password', undefined | 'wrong'>

/** Verify password and set token */
export async function authByPassword (password: string) {
  const data = await getResponseData<
    AuthByPasswordRequest,
    AuthByPasswordResponse
  >(urls.authByPassword, { password })
  if (data.result === 'success') {
    setToken(data.token)
  }
  return data
}
