import { fetchAPI } from '../utils'
import * as urls from '../../utils/config'
import {
  SendSMSToUser,
  DisableSMSAuth,
  EnableSMSAuth,
  SendSMSAndSaveNumber,
  AuthBySMSCode
} from 'shared/endpoints/auth'
import { setToken } from './tokenService'

export async function sendSMSToUser() {
  return await fetchAPI<SendSMSToUser.Request, SendSMSToUser.Response>(
    'post',
    urls.sendSMSToUser
  )
}

/** Verify smscode and set token */
export async function authBySMSCode(smscode: string) {
  const data = await fetchAPI<AuthBySMSCode.Request, AuthBySMSCode.Response>(
    'post',
    urls.authBySMSCode,
    { smscode }
  )
  if (data.result === 'success') {
    setToken(data.token)
  }
  return data
}

export async function sendSMSAndSaveNumber(phoneNumber: string) {
  return await fetchAPI<
    SendSMSAndSaveNumber.Request,
    SendSMSAndSaveNumber.Response
  >('post', urls.sendSMSAndSaveNumber, {
    number: phoneNumber
  })
}

export async function enableSMSAuth(smscode: string) {
  return await fetchAPI<EnableSMSAuth.Request, EnableSMSAuth.Response>(
    'post',
    urls.enableSMSAuth,
    { smscode }
  )
}

export async function disableSMSAuth() {
  return await fetchAPI<DisableSMSAuth.Request, DisableSMSAuth.Response>(
    'post',
    urls.disableSMSAuth
  )
}
