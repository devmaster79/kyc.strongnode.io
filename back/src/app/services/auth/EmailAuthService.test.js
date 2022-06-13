/* eslint-disable sonarjs/no-identical-functions */
const { describe, it } = require('mocha')
const assert = require('assert')
const { EmailAuthService } = require('./EmailAuthService')
const {
  TokenService,
  MODE_FULL,
  MODE_REGISTRATION,
  MODE_2FA
} = require('./TokenService')

describe('Email Authentication', () => {
  const tokenService = new TokenService()
  it('should work for registered users', async () => {
    let userRecord = {
      username: 'test',
      email: 'test@test.com',
      password: '',
      enablePassword: false,
      enableAuthenticator: false,
      enableSms: false
    }
    const fakeUserRepository = {
      async findOne() {
        return userRecord
      },
      async update(data, query) {
        assert.equal(userRecord.email, query.where.email)
        userRecord = { ...userRecord, ...data }
        return [1]
      }
    }
    const fakeEmailService = {
      sendTemplate(to, _template, templateData) {
        assert.equal(to, userRecord.email)
        let token = templateData.link.split('token=')[1]
        assert.ok(token.length)
        let decoded = tokenService.decode(token, [MODE_FULL])
        assert.notEqual(decoded, null)
        assert.equal(decoded.email, userRecord.email)
        assert.equal(decoded.username, userRecord.username)
      }
    }
    const emailAuthService = new EmailAuthService(
      fakeUserRepository,
      fakeEmailService,
      tokenService
    )

    await emailAuthService.sendVerificationEmail(userRecord.email)
  })

  it('should work for registered users with 2fa', async () => {
    let userRecord = {
      username: 'test',
      email: 'test@test.com',
      password: '',
      enablePassword: true,
      enableAuthenticator: true,
      enableSms: true
    }
    const fakeUserRepository = {
      async findOne() {
        return userRecord
      },
      async update(data, query) {
        assert.equal(userRecord.email, query.where.email)
        userRecord = { ...userRecord, ...data }
        return [1]
      }
    }
    const fakeEmailService = {
      sendTemplate(to, template, templateData) {
        assert.equal(to, userRecord.email)
        let token = templateData.link.split('token=')[1]
        assert.ok(token.length)
        let decoded = tokenService.decode(token, [MODE_2FA])
        assert.notEqual(decoded, null)
        assert.equal(decoded.email, userRecord.email)
        assert.equal(decoded.username, userRecord.username)
      }
    }
    const emailAuthService = new EmailAuthService(
      fakeUserRepository,
      fakeEmailService,
      tokenService
    )

    await emailAuthService.sendVerificationEmail(userRecord.email)
  })

  it('should work for non-registered users', async () => {
    const email = 'test@test.com'
    const fakeUserRepository = {
      async findOne() {
        return null
      },
      async update(_data, _query) {
        return [0]
      }
    }
    const fakeEmailService = {
      sendTemplate(to, template, templateData) {
        assert.equal(to, email)
        let token = templateData.link.split('token=')[1]
        assert.ok(token.length)
        let decoded = tokenService.decode(token, [MODE_REGISTRATION])
        assert.notEqual(decoded, null)
        assert.equal(decoded.email, email)
        assert.equal(decoded.username, null)
      }
    }
    const emailAuthService = new EmailAuthService(
      fakeUserRepository,
      fakeEmailService,
      tokenService
    )

    await emailAuthService.sendVerificationEmail(email)
  })
})
