import { describe, it } from 'mocha'
import assert from 'assert'
import { EmailService } from './EmailService'
import { RegistrationTemplate } from './templates/RegistrationTemplate'
import { SendEmailRequest, SES } from '@aws-sdk/client-ses'

describe('EmailService', () => {
  const EMAIL = 'test@test.com'
  const LINK = 'https://test.com'

  it('should be able to call aws right', async () => {
    let called = false
    const fakeSES = {
      sendEmail(params: SendEmailRequest) {
        assert.equal(params?.Destination?.ToAddresses?.[0], EMAIL)
        assert.ok(params?.Message?.Body?.Html?.Data?.indexOf(LINK) !== -1)
        called = true
      }
    }
    const emailService = new EmailService(fakeSES as unknown as SES)
    await emailService.sendTemplate(EMAIL, new RegistrationTemplate(), {
      link: LINK
    })
    assert.ok(called)
  })
})
