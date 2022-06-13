/* eslint-disable no-global-assign */
const { describe, teardown, it } = require('mocha')
const assert = require('assert')
const { AuthenticatorAuthService } = require('./AuthenticatorAuthService')
const { TokenService } = require('./TokenService')

const OriginalDate = Date
const setTime = (t) => {
  Date = {
    now() {
      return t
    }
  }
}
const resetTime = () => {
  Date = OriginalDate
}

describe('Authenticator Authentication', () => {
  const tokenService = new TokenService()
  it('should work', async () => {
    let actualToken
    let userRecord = {
      email: 'test@test.com',
      password: '',
      enablePassword: false,
      enableAuthenticator: false,
      enableSms: false
    }

    const fakeUserRepository = {
      findOne() {
        return userRecord
      },
      update(data, query) {
        assert.equal(userRecord.email, query.where.email)
        if (data.authenticatorQrSecret && data.authenticatorQrSecret.length) {
          setTime(1000)
          data.authenticatorQrSecret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'
          // with this date and secret the token will be this:
          actualToken = '755224'
        }

        userRecord = { ...userRecord, ...data }
        return [1]
      }
    }

    const service = new AuthenticatorAuthService(
      fakeUserRepository,
      tokenService
    )
    const preAuthResult = await service.authByAuthenticator(
      userRecord.email,
      '123123'
    )
    assert.equal(preAuthResult, null)

    const generateResult = await service.generateQRCode(userRecord.email)
    assert.equal(typeof generateResult.qrcode, 'string')
    assert.equal(typeof generateResult.secret, 'string')

    const activateResult = await service.activateAuthenticatorAuth(
      userRecord.email,
      actualToken
    )
    assert.equal(activateResult, true)

    const authResult = await service.authByAuthenticator(
      userRecord.email,
      actualToken
    )
    assert.equal(typeof authResult, 'string')
  })

  teardown(() => {
    resetTime()
  })
})
