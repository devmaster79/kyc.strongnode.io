import { SMS_CONFIG } from '../../config/config'
import { Pinpoint } from 'aws-sdk'
import { MessageType, SendMessagesRequest } from 'aws-sdk/clients/pinpoint'
import { Logger } from '../Logger'

export class SmsService {
  constructor(
    private __awsPinpoint: Pinpoint,
    private __logger = new Logger('SmsService')
  ) {}

  /**
   * Method that takes care of sending SMS to a phone number.
   */
  async send(
    destinationNumber: string,
    message: string,
    messageType: MessageType = 'TRANSACTIONAL'
  ): Promise<void> {
    const params: SendMessagesRequest = {
      ApplicationId: process.env.ApplicationId
        ? process.env.ApplicationId
        : 'fakeAppIDLocalstack',
      MessageRequest: {
        Addresses: {
          [destinationNumber]: {
            ChannelType: 'SMS'
          }
        },
        MessageConfiguration: {
          SMSMessage: {
            Body: message,
            Keyword: SMS_CONFIG.registeredKeyword,
            MessageType: messageType,
            OriginationNumber: SMS_CONFIG.origin,
            SenderId: SMS_CONFIG.senderId
          }
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      this.__logger.devLog(
        'It would send SMS in production with these params:',
        params
      )
      return
    }

    const response = await this.__awsPinpoint.sendMessages(params).promise()
    if (response.$response.error) {
      this.__logger.error('Unable to send SMS.', response.$response.error)
      throw new Error('Unable to send SMS.')
    }
  }
}
