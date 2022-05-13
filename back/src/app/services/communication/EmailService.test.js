const { describe, it } = require('mocha')
const assert = require('assert')
const { EmailService } = require('./EmailService')
const { RegistrationTemplate } = require('./templates/RegistrationTemplate')

describe('EmailService', () => {
  const EMAIL = 'test@test.com'
  const LINK = 'https://test.com'

  it('should be able to call aws right', async () => {
    let called = false
    const fakeSES = {
      /**
       * @param {import('aws-sdk/clients/ses').SendEmailRequest} params
       */
      sendEmail(params) {
        assert.equal(params.Destination.ToAddresses[0], EMAIL)
        assert.ok(params.Message.Body.Html.Data.indexOf(LINK) !== -1)
        called = true
        return {
          promise() {
            return Promise.resolve({
              $response: {
                error: undefined
              }
            })
          }
        }
      }
    }
    const emailService = new EmailService(fakeSES)
    await emailService.sendTemplate(EMAIL, new RegistrationTemplate(), {
      link: LINK
    })
    assert.ok(called)
  })
})
