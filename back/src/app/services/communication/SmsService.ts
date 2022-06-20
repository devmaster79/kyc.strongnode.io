import { SMS_CONFIG } from '../../config/config'
import {
  Pinpoint,
  MessageType,
  SendMessagesRequest
} from '@aws-sdk/client-pinpoint'
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
    rawMessage: string,
    messageType: MessageType = MessageType.TRANSACTIONAL
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
            Body: rawMessage,
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

    await this.__awsPinpoint.sendMessages(params)
  }
}
