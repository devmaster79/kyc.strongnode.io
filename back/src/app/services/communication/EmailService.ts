import { SendEmailRequest, SES } from '@aws-sdk/client-ses'
import { EMAIL_CONFIG } from '../../config/config'
import { Logger } from '../Logger'
import { Sendable } from './templates/BaseTemplate'

// regExp used for checking inputs
const emailRegExp =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/

export class EmailService {
  constructor(
    private __awsSes: SES,
    private __logger = new Logger('EmailService')
  ) {}

  async sendTemplate<P, T extends Sendable<P>>(
    to: string,
    template: T,
    templateData: Parameters<T['renderBody']>[0]
  ): Promise<void> {
    if (process.env.NODE_ENV == 'development') {
      this.__logger.log('[LocalStack] Email sent: ', templateData)
      return
    }
    return await this.__send(
      to,
      template.renderSubject(templateData),
      template.renderBody(templateData)
    )
  }

  async __send(to: string, subject: string, message: string): Promise<void> {
    // check if parameter is email
    if (!emailRegExp.test(to)) throw Error('Wrong email address')

    // default AWS SES email options
    const defaultEmailOptions: SendEmailRequest = {
      Destination: {
        ToAddresses: [to]
      },
      Source: EMAIL_CONFIG.source,
      Message: {
        Subject: {
          Data: subject
        },
        Body: {
          Html: {
            Data: message
          }
        }
      }
    }

    await this.__awsSes.sendEmail(defaultEmailOptions)
  }
}
