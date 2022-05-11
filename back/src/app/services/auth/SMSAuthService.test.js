const { describe, it } = require('mocha')
const assert = require('assert')
const { SMSAuthService } = require('./SMSAuthService')
const { TokenService } = require('./TokenService')

describe('SMS authentication', () => {
  const tokenService = new TokenService()
  it('should work', async () => {
    let phone_number = '+36701112222'
    let userRecord = {
      email: 'test@test.com',
      password: '',
      enable_password: false,
      enable_authenticator: false,
      enable_sms: false,
      smscode: ''
    }

    const fakeUserRepository = {
      findOne() {
        return userRecord
      },
      update(data, query) {
        assert.equal(userRecord.email, query.where.email)
        userRecord = { ...userRecord, ...data }
        return [1]
      }
    }
    const fakeSmsService = {
      send(destinationNumber, message) {
        assert.ok(message.indexOf(userRecord.smscode) !== -1)
        assert.equal(destinationNumber, phone_number)
      }
    }
    const smsAuthService = new SMSAuthService(
      fakeUserRepository,
      fakeSmsService,
      tokenService
    )

    // Failing attempt
    const preAuthResult = await smsAuthService.authBySMS(
      userRecord.email,
      'something'
    )
    assert.equal(preAuthResult, null)

    // Activate
    await smsAuthService.sendSMSAndStoreNumber(userRecord.email, phone_number)
    assert.equal(userRecord.phone_number, phone_number)
    const activateResult = await smsAuthService.activateSMSAuth(
      userRecord.email,
      userRecord.smscode
    )
    assert.equal(activateResult, true)
    assert.equal(userRecord.enable_sms, true)

    // Auth
    await smsAuthService.sendSMS(userRecord.email, phone_number)
    const authResult = await smsAuthService.authBySMS(
      userRecord.email,
      userRecord.smscode
    )
    assert.equal(typeof authResult, 'string')

    // Disable SMS auth
    await smsAuthService.deactivate(userRecord.email)
    assert.equal(userRecord.enable_sms, false)
  })
})
