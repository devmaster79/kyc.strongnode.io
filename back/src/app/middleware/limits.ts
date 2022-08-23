import {
  createLimit,
  identifyByAuth,
  identifyByEmailAndIP
} from './utils/createLimit'

// To add limits edit the limiter-service

export const sendSMSLimit = createLimit('smsSend', identifyByAuth)
export const authOTPLimit = createLimit('authenticatorAuth', identifyByAuth)
export const authPasswordLimit = createLimit(
  'passwordAuth',
  identifyByEmailAndIP
)
export const identityVerificationLimit = createLimit(
  'identityVerificationLimit',
  identifyByAuth
)
