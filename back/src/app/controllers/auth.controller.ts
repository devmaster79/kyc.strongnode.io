import { TokenService } from '../services/auth/TokenService'
import { EmailAuthService } from '../services/auth/EmailAuthService'
import { PasswordAuthService } from '../services/auth/PasswordAuthService'
import { SMSAuthService } from '../services/auth/SMSAuthService'
import { AuthenticatorAuthService } from '../services/auth/AuthenticatorAuthService'
import {
  RegistrationService,
  UserNameIsAlreadyTakenError,
  LimitReachedError
} from '../services/auth/RegistrationService'
import { GravatarService } from '../services/GravatarService'
import { EmailService } from '../services/communication/EmailService'
import { SmsService } from '../services/communication/SmsService'
import { AWS_PINPOINT_CONFIG, AWS_SES_CONFIG } from 'app/config/config'
import {
  zodValidationError,
  success,
  apiResponse
} from 'shared/endpoints/responses'
import {
  sendSMSLimit,
  authOTPLimit,
  authPasswordLimit
} from '../middleware/limits'
import { Request } from 'express'
import { UserRequest, withResponse } from './utils'
import {
  SendVerificationEmail,
  Register,
  EnablePasswordAuth,
  DisablePasswordAuth,
  AuthByPassword,
  SendSMSToUser,
  AuthBySMSCode,
  SendSMSAndSaveNumber,
  EnableSMSAuth,
  DisableSMSAuth,
  AuthByAuthenticator,
  GenerateAuthenticatorQRCode,
  EnableAuthenticatorAuth,
  DisableAuthenticatorAuth
} from 'shared/endpoints/auth'
import { Pinpoint } from '@aws-sdk/client-pinpoint'
import { SES } from '@aws-sdk/client-ses'
import { RequestWithLimit } from 'app/middleware/utils/createLimit'

const smsService = new SmsService(new Pinpoint(AWS_PINPOINT_CONFIG()))
const emailService = new EmailService(new SES(AWS_SES_CONFIG()))
const userRepository = require('../models').users
const tokenService = new TokenService()
const emailAuthService = new EmailAuthService(
  userRepository,
  emailService,
  tokenService
)
const passwordAuthService = new PasswordAuthService(
  userRepository,
  tokenService
)
const smsAuthService = new SMSAuthService(
  userRepository,
  smsService,
  tokenService
)
const authenticatorAuthService = new AuthenticatorAuthService(
  userRepository,
  tokenService
)
const gravatarService = new GravatarService()
const registrationService = new RegistrationService(
  userRepository,
  tokenService,
  gravatarService
)

export const sendVerificationEmail =
  withResponse<SendVerificationEmail.Response>(async (req: Request) => {
    const data = SendVerificationEmail.schema.parse(req.body)
    await emailAuthService.sendVerificationEmail(data.email)
    return success({ message: 'We have sent you an email successfully.' })
  })

export const register = withResponse<Register.Response>(async (req) => {
  const data = Register.schema.parse(req.body)
  try {
    const token = await registrationService.createUser({
      email: req.user.email,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName
    })

    return success({
      token,
      message: 'Successful registration. You can sign in now.'
    })
  } catch (error: unknown) {
    if (error instanceof UserNameIsAlreadyTakenError) {
      return zodValidationError([
        {
          code: 'custom',
          path: ['username'],
          message: 'This username is already taken'
        }
      ])
    } else if (error instanceof LimitReachedError) {
      return apiResponse('limit-reached-error', 403, {
        message:
          'Sorry but we cannot accept more registrations currently. Please get back later.'
      })
    }
    throw error
  }
})

export const enablePasswordAuth = withResponse<EnablePasswordAuth.Response>(
  async (req) => {
    const data = EnablePasswordAuth.schema.parse(req.body)
    await passwordAuthService.setPassword(req.user.email, data.password)
    return success({
      message: 'You enabled password authentication successfully.'
    })
  }
)

export const disablePasswordAuth = withResponse<DisablePasswordAuth.Response>(
  async (req) => {
    await passwordAuthService.removePassword(req.user.email)
    return success({
      message: 'You disabled password authentication successfully.'
    })
  }
)

export const authByPassword = withResponse<
  AuthByPassword.Response,
  RequestWithLimit<UserRequest>
>(async (req) => {
  const data = AuthByPassword.schema.parse(req.body)
  const token = await passwordAuthService.authByPassword(
    req.user.email,
    data.password
  )
  if (!token) {
    return zodValidationError([
      {
        code: 'custom',
        path: ['password'],
        message: 'Wrong password.'
      }
    ])
  }
  authPasswordLimit.resolve(req)
  return success({ token, message: 'Good credentials, redirecting...' })
})

export const sendSMSToUser = withResponse<SendSMSToUser.Response>(
  async (req) => {
    await smsAuthService.sendSMS(req.user.email)
    return success({ message: 'We have sent you an SMS.' })
  }
)

export const authBySMSCode = withResponse<
  AuthBySMSCode.Response,
  RequestWithLimit<UserRequest>
>(async (req) => {
  const data = AuthBySMSCode.schema.parse(req.body)
  const token = await smsAuthService.authBySMS(req.user.email, data.smscode)
  if (!token) {
    return zodValidationError([
      {
        code: 'custom',
        path: ['smscode'],
        message: 'Wrong smscode'
      }
    ])
  }
  sendSMSLimit.resolve(req)
  authOTPLimit.resolve(req)
  return success({ token, message: 'Good SMS code, redirecting...' })
})

export const sendSMSAndSaveNumber = withResponse<SendSMSAndSaveNumber.Response>(
  async (req) => {
    const data = SendSMSAndSaveNumber.schema.parse(req.body)
    await smsAuthService.sendSMSAndStoreNumber(req.user.email, data.number)
    return success({ message: 'We have sent you an SMS.' })
  }
)

export const enableSMSAuth = withResponse<
  EnableSMSAuth.Response,
  RequestWithLimit<UserRequest>
>(async (req) => {
  const data = EnableSMSAuth.schema.parse(req.body)
  const result = await smsAuthService.activateSMSAuth(
    req.user.email,
    data.smscode
  )
  if (!result) {
    return zodValidationError([
      {
        code: 'custom',
        path: ['smscode'],
        message: 'Wrong smscode'
      }
    ])
  }
  sendSMSLimit.resolve(req)
  return success({
    message: 'You enabled SMS authentication sucessfully.'
  })
})

export const disableSMSAuth = withResponse<DisableSMSAuth.Response>(
  async (req) => {
    await smsAuthService.deactivate(req.user.email)
    return success({ message: 'You disabled SMS authentication successfully.' })
  }
)

export const authByAuthenticator = withResponse<
  AuthByAuthenticator.Response,
  RequestWithLimit<UserRequest>
>(async (req) => {
  const data = AuthByAuthenticator.schema.parse(req.body)
  const token = await authenticatorAuthService.authByAuthenticator(
    req.user.email,
    data.token
  )
  if (!token)
    return zodValidationError([
      {
        code: 'custom',
        path: ['token'],
        message: 'Wrong OTP'
      }
    ])
  authOTPLimit.resolve(req)
  return success({ token, message: 'Good OTP, redirecting...' })
})

export const generateAuthenticatorQRCode =
  withResponse<GenerateAuthenticatorQRCode.Response>(async (req) => {
    const result = await authenticatorAuthService.generateQRCode(req.user.email)
    return success({
      // Note that the secret is a number that users can use to register an authenticator.
      // The QR is the secret in a mobile readable form, so users don't have to type that in.
      // It's only safe to share the secret when we setup the autentication.
      qrcode: result.qrcode,
      secret: result.secret,
      message:
        'A new secret has been generated and written to your account, you have to setup an authenticator now.'
    })
  })

export const enableAuthenticatorAuth =
  withResponse<EnableAuthenticatorAuth.Response>(async (req) => {
    const data = EnableAuthenticatorAuth.schema.parse(req.body)
    const result = await authenticatorAuthService.activateAuthenticatorAuth(
      req.user.email,
      data.token
    )
    if (!result)
      return zodValidationError([
        {
          code: 'custom',
          path: ['token'],
          message: 'Wrong OTP'
        }
      ])
    return success({
      message: 'You enabled authenticator authentication sucessfully.'
    })
  })

export const disableAuthenticatorAuth =
  withResponse<DisableAuthenticatorAuth.Response>(async (req) => {
    await authenticatorAuthService.deactivateAuthenticatorAuth(req.user.email)
    return success({
      message: 'You disabled authenticator authentication successfully.'
    })
  })
