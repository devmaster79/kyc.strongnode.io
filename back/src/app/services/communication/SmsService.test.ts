import { describe, it } from 'mocha'
import assert from 'assert'
import { SmsService } from './SmsService'
import { Pinpoint, SendMessagesRequest } from '@aws-sdk/client-pinpoint'

describe('SmsService', () => {
  const PHONE_NUMBER = '+999999'
  const MESSAGE = 'Something'

  it('should be able to call aws right', async () => {
    let called = false
    const fakePinpoint = {
      async sendMessages(params: SendMessagesRequest) {
        assert.equal(
          params.MessageRequest?.Addresses?.[PHONE_NUMBER]?.ChannelType,
          'SMS'
        )
        assert.equal(
          params.MessageRequest?.MessageConfiguration?.SMSMessage?.Body,
          MESSAGE
        )
        called = true
        return 'done'
      }
    }
    const smsService = new SmsService(fakePinpoint as unknown as Pinpoint)
    await smsService.send(PHONE_NUMBER, MESSAGE)
    assert.ok(called)
  })
})
