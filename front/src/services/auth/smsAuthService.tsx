import { getResponseData, setToken } from './utils'
import * as urls from '../../utils/config'
import {
  SendSMSToUser,
  DisableSMSAuth,
  EnableSMSAuth,
  SendSMSAndSaveNumber,
  AuthBySMSCode
} from 'shared/endpoints/auth'

export async function sendSMSToUser() {
  return await getResponseData<SendSMSToUser.Request, SendSMSToUser.Response>(
    urls.sendSMSToUser
  )
}

/** Verify smscode and set token */
export async function authBySMSCode(smscode: string) {
  const data = await getResponseData<
    AuthBySMSCode.Request,
    AuthBySMSCode.Response
  >(urls.authBySMSCode, { smscode })
  if (data.result === 'success') {
    setToken(data.token)
  }
  return data
}

export async function sendSMSAndSaveNumber(phoneNumber: string) {
  return await getResponseData<
    SendSMSAndSaveNumber.Request,
    SendSMSAndSaveNumber.Response
  >(urls.sendSMSAndSaveNumber, {
    number: phoneNumber
  })
}

export async function enableSMSAuth(smscode: string) {
  return await getResponseData<EnableSMSAuth.Request, EnableSMSAuth.Response>(
    urls.enableSMSAuth,
    { smscode }
  )
}

export async function disableSMSAuth() {
  return await getResponseData<DisableSMSAuth.Request, DisableSMSAuth.Response>(
    urls.disableSMSAuth
  )
}
