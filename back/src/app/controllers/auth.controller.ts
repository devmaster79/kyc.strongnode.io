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
import { AWS_CONFIG } from 'app/config/config'
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
import { withResponse } from './utils'
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
import AWS from 'aws-sdk'

const smsService = new SmsService(new AWS.Pinpoint(AWS_CONFIG()))
const emailService = new EmailService(new AWS.SES(AWS_CONFIG()))
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
    return success({})
  })

export const register = withResponse<Register.Response>(async (req) => {
  const data = Register.schema.parse(req.body)
  try {
    const token = await registrationService.createUser({
      email: req.user.email,
      user_name: data.user_name,
      first_name: data.first_name,
      last_name: data.last_name
    })
    return success({ token })
  } catch (error: unknown) {
    if (error instanceof UserNameIsAlreadyTakenError) {
      return zodValidationError([
        {
          code: 'custom',
          path: ['user_name'],
          message: 'This username is already taken'
        }
      ])
    } else if (error instanceof LimitReachedError) {
      return apiResponse('limit-reached-error', 403, {})
    }
    throw error
  }
})

export const enablePasswordAuth = withResponse<EnablePasswordAuth.Response>(
  async (req) => {
    const data = EnablePasswordAuth.schema.parse(req.body)
    await passwordAuthService.setPassword(req.user.email, data.password)
    return success({})
  }
)

export const disablePasswordAuth = withResponse<DisablePasswordAuth.Response>(
  async (req) => {
    await passwordAuthService.removePassword(req.user.email)
    return success({})
  }
)

export const authByPassword = withResponse<AuthByPassword.Response>(
  async (req) => {
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
    return success({ token })
  }
)

export const sendSMSToUser = withResponse<SendSMSToUser.Response>(
  async (req) => {
    await smsAuthService.sendSMS(req.user.email)
    return success({})
  }
)

export const authBySMSCode = withResponse<AuthBySMSCode.Response>(
  async (req) => {
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
    return success({ token })
  }
)

export const sendSMSAndSaveNumber = withResponse<SendSMSAndSaveNumber.Response>(
  async (req) => {
    const data = SendSMSAndSaveNumber.schema.parse(req.body)
    await smsAuthService.sendSMSAndStoreNumber(req.user.email, data.number)
    return success({})
  }
)

export const enableSMSAuth = withResponse<EnableSMSAuth.Response>(
  async (req) => {
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
    return success({})
  }
)

export const disableSMSAuth = withResponse<DisableSMSAuth.Response>(
  async (req) => {
    await smsAuthService.deactivate(req.user.email)
    return success({})
  }
)

export const authByAuthenticator = withResponse<AuthByAuthenticator.Response>(
  async (req) => {
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
    return success({ token })
  }
)

export const generateAuthenticatorQRCode =
  withResponse<GenerateAuthenticatorQRCode.Response>(async (req) => {
    const result = await authenticatorAuthService.generateQRCode(req.user.email)
    return success({
      // Note that the secret is a number that users can use to register an authenticator.
      // The QR is the secret in a mobile readable form, so users don't have to type that in.
      // It's only safe to share the secret when we setup the autentication.
      qrcode: result.qrcode,
      secret: result.secret
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
    return success({})
  })

export const disableAuthenticatorAuth =
  withResponse<DisableAuthenticatorAuth.Response>(async (req) => {
    await authenticatorAuthService.deactivateAuthenticatorAuth(req.user.email)
    return success({})
  })
