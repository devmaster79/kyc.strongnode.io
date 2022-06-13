const { describe, it } = require('mocha')
const assert = require('assert')
const { SMSAuthService } = require('./SMSAuthService')
const { TokenService } = require('./TokenService')

describe('SMS authentication', () => {
  const tokenService = new TokenService()
  it('should work', async () => {
    let phoneNumber = '+36701112222'
    let userRecord = {
      email: 'test@test.com',
      password: '',
      enablePassword: false,
      enableAuthenticator: false,
      enableSms: false,
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
        assert.equal(destinationNumber, phoneNumber)
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
    await smsAuthService.sendSMSAndStoreNumber(userRecord.email, phoneNumber)
    assert.equal(userRecord.phoneNumber, phoneNumber)
    const activateResult = await smsAuthService.activateSMSAuth(
      userRecord.email,
      userRecord.smscode
    )
    assert.equal(activateResult, true)
    assert.equal(userRecord.enableSms, true)

    // Auth
    await smsAuthService.sendSMS(userRecord.email, phoneNumber)
    const authResult = await smsAuthService.authBySMS(
      userRecord.email,
      userRecord.smscode
    )
    assert.equal(typeof authResult, 'string')

    // Disable SMS auth
    await smsAuthService.deactivate(userRecord.email)
    assert.equal(userRecord.enableSms, false)
  })
})
