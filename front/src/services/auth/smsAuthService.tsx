import { getResponseData, setToken } from './utils'
import * as urls from '../../utils/config'
import { BannedError, GenericResponse, ValidationError } from './responses'

export async function sendSMSToUser (): Promise<GenericResponse | BannedError> {
  return await getResponseData(urls.sendSMSToUser)
}

/** Verify smscode and set token */
export async function authBySMSCode (
  smscode: string
): Promise<
  | GenericResponse
  | BannedError
  | ValidationError<'smscode', undefined>
  | ValidationError<'smscode', 'wrong'>
> {
  const data = await getResponseData(urls.authBySMSCode, { smscode })
  if (data.token) {
    setToken(data.token)
  }
  return data
}

export async function sendSMSAndSaveNumber (
  phoneNumber: string
): Promise<
  GenericResponse | BannedError | ValidationError<'number', undefined>
> {
  return await getResponseData(urls.sendSMSAndSaveNumber, {
    number: phoneNumber
  })
}

export async function enableSMSAuth (
  smscode: string
): Promise<
  | GenericResponse
  | ValidationError<'smscode', undefined>
  | ValidationError<'smscode', 'wrong'>
> {
  return await getResponseData(urls.enableSMSAuth, { smscode })
}

export async function disableSMSAuth (): Promise<GenericResponse> {
  return await getResponseData(urls.disableSMSAuth)
}
