const { describe, it } = require('mocha')
const assert = require('assert')
const { PasswordAuthService } = require('./PasswordAuthService')
const { TokenService } = require('./TokenService')

describe('Password authentication', () => {
  const tokenService = new TokenService()
  it('should work', async () => {
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
        userRecord = { ...userRecord, ...data }
        return [1]
      }
    }
    const passwordAuthService = new PasswordAuthService(
      fakeUserRepository,
      tokenService
    )

    await passwordAuthService.setPassword(userRecord.email, 'something')
    assert.equal(userRecord.enablePassword, true)
    const authResult = await passwordAuthService.authByPassword(
      userRecord.email,
      'something'
    )
    assert.equal(typeof authResult, 'string')
    await passwordAuthService.removePassword(userRecord.email)
    assert.equal(userRecord.enablePassword, false)
  })
})
