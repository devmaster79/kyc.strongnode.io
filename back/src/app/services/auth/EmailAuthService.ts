import {
  MODE_GUEST,
  MODE_REGISTRATION,
  MODE_2FA,
  MODE_FULL,
  AuthMode
} from './TokenService'
import * as routes from 'shared/routes'
import { RegistrationTemplate } from '../communication/templates/RegistrationTemplate'
import { SignInTemplate } from '../communication/templates/SignInTemplate'
import type { EmailService } from '../communication/EmailService'
import type { TokenService } from './TokenService'
import { User as UserRepository } from '../../models'
import { User as UserModel } from '../../models/user.model'

export class EmailAuthService {
  constructor(
    private __userRepository: typeof UserRepository,
    private __emailService: EmailService,
    private __tokenService: TokenService
  ) {}

  /**
   * send email with link for the next step
   * if not registered -> signin link
   * if registered -> signup link
   */
  async sendVerificationEmail(email: string) {
    email = email.toLowerCase()
    let link
    const user = await this.__userRepository.findOne({ where: { email } })
    if (user) {
      const mode = this.__tokenService.determineNextMode(user, MODE_GUEST)
      const token = this.__tokenService.generateToken(
        email,
        user.username,
        mode
      )
      link = this.__getURL(mode, token, user)
      await this.__emailService.sendTemplate(email, new SignInTemplate(), {
        link,
        userName: user.username
      })
    } else {
      const mode = MODE_REGISTRATION
      const token = this.__tokenService.generateToken(email, null, mode)
      link = this.__getURL(mode, token, undefined)
      await this.__emailService.sendTemplate(
        email,
        new RegistrationTemplate(),
        { link }
      )
    }
  }

  private __getURL(mode: AuthMode, token: string, user?: UserModel) {
    return new URL(this.__getRoute(mode, token, user), process.env.FRONTEND_URL)
      .href
  }

  private __getRoute(mode: AuthMode, token: string, user?: UserModel) {
    switch (mode.id) {
      case MODE_GUEST.id:
        return ''
      case MODE_REGISTRATION.id:
        return `${routes.REGISTER}?token=${token}`
      case MODE_2FA.id:
        if (user && user.enableAuthenticator)
          return `${routes.SIGN_IN_WITH_AUTHENTICATOR}?token=${token}`
        if (user && user.enableSms)
          return `${routes.SIGN_IN_WITH_SMS}?token=${token}`
        if (user && user.enablePassword)
          return `${routes.SIGN_IN_WITH_PASSWORD}?token=${token}`
        return `${routes.SIGN_IN_WITH_TOKEN}?token=${token}`
      case MODE_FULL.id:
        return `${routes.SIGN_IN_WITH_TOKEN}?token=${token}`
      default:
        throw 'Unexpected mode.id: ' + mode.id
    }
  }
}

/** @deprecated */
module.exports = {
  EmailAuthService
}
