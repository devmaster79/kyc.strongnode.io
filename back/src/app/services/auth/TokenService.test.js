const { describe, it } = require('mocha')
const assert = require('assert')
const TokenService = require('./TokenService')
const { UserLevel } = require('app/models/user.model')

describe('TokenService', () => {
  const tokenService = new TokenService.TokenService()
  let modes = Object.keys(TokenService)
    .filter((key) => key.startsWith('MODE_'))
    .map((mode) => TokenService[mode])

  it('should not allow different modes for different tokens', () => {
    for (let originalMode of modes) {
      let token = tokenService.generateToken(
        'test@test.com',
        'testUserName',
        UserLevel.User,
        originalMode
      )
      let decoded = tokenService.decode(token, [originalMode])
      assert.equal(decoded.email, 'test@test.com')
      assert.equal(decoded.username, 'testUserName')

      for (let mode of modes) {
        if (mode.id != originalMode.id) {
          // if the mode different, it should disallow the token
          let decoded = tokenService.decode(token, [mode])
          assert.equal(decoded, null)
        }
      }
    }
  })

  it('should be able to decode the token with at least one allowed mode', () => {
    let token, decoded
    token = tokenService.generateToken(
      'test@test.com',
      'testUserName',
      UserLevel.User,
      TokenService.MODE_FULL
    )
    decoded = tokenService.decode(token, [
      TokenService.MODE_2FA,
      TokenService.MODE_FULL
    ])
    assert.equal(decoded.email, 'test@test.com')

    decoded = tokenService.decode(token, [
      TokenService.MODE_FULL,
      TokenService.MODE_2FA
    ])
    assert.equal(decoded.email, 'test@test.com')
  })

  it('should be able to determine the next mode', () => {
    let nextMode = tokenService.determineNextMode(
      {
        enableSms: false,
        enableAuthenticator: false,
        enablePassword: false
      },
      TokenService.MODE_GUEST
    )

    assert.equal(nextMode.id, TokenService.MODE_FULL.id)
  })

  it('should be able to determine the next mode 2fa', () => {
    let nextMode = tokenService.determineNextMode(
      {
        enableSms: true,
        enableAuthenticator: true,
        enablePassword: true
      },
      TokenService.MODE_GUEST
    )

    assert.equal(nextMode.id, TokenService.MODE_2FA.id)
  })
})
