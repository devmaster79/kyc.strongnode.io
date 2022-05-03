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

type SendSMSToUserRequest = Record<never, never>
type SendSMSToUserResponse = GenericResponse | BannedError
export async function sendSMSToUser() {
  return await getResponseData<SendSMSToUserRequest, SendSMSToUserResponse>(
    urls.sendSMSToUser
  )
}

type AuthBySMSCodeRequest = { smscode: string }
type AuthBySMSCodeResponse =
  | (Success & { token: string })
  | UnauthorizedError
  | UnexpectedError
  | BannedError
  | ValidationError<'smscode', undefined>
  | ValidationError<'smscode', 'wrong'>
/** Verify smscode and set token */
export async function authBySMSCode(smscode: string) {
  const data = await getResponseData<
    AuthBySMSCodeRequest,
    AuthBySMSCodeResponse
  >(urls.authBySMSCode, { smscode })
  if (data.result === 'success') {
    setToken(data.token)
  }
  return data
}

type SendSMSAndSaveNumberRequest = { number: string }
type SendSMSAndSaveNumberResponse =
  | GenericResponse
  | BannedError
  | ValidationError<'number', undefined>
export async function sendSMSAndSaveNumber(phoneNumber: string) {
  return await getResponseData<
    SendSMSAndSaveNumberRequest,
    SendSMSAndSaveNumberResponse
  >(urls.sendSMSAndSaveNumber, {
    number: phoneNumber
  })
}

type EnableSMSAuthRequest = { smscode: string }
type EnableSMSAuthResponse =
  | GenericResponse
  | ValidationError<'smscode', undefined>
  | ValidationError<'smscode', 'wrong'>
export async function enableSMSAuth(smscode: string) {
  return await getResponseData<EnableSMSAuthRequest, EnableSMSAuthResponse>(
    urls.enableSMSAuth,
    {
      smscode
    }
  )
}

type DisableSMSAuthRequest = Record<never, never>
type DisableSMSAuthResponse = GenericResponse
export async function disableSMSAuth() {
  return await getResponseData<DisableSMSAuthRequest, DisableSMSAuthResponse>(
    urls.disableSMSAuth
  )
}
