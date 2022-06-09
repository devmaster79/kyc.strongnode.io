const { describe, it } = require('mocha')
const assert = require('assert')
const { TokenService } = require('./TokenService')
const {
  RegistrationService,
  EmailIsAlreadyRegisteredError,
  UserNameIsAlreadyTakenError,
  LimitReachedError
} = require('./RegistrationService')

describe('Registration service', () => {
  const tokenService = new TokenService()
  const fakeGravatarService = (withResponse) => ({
    async getProfileImageURL(_email) {
      return withResponse
    }
  })

  it('should throw error when email is registered', async () => {
    let userRecord = {
      email: 'test@test.com',
      username: 'test'
    }

    const fakeUserRepository = {
      findOne(query) {
        if (query.where.email == userRecord.email) {
          return userRecord
        } else {
          return null
        }
      },
      create(_data) {
        assert.ok(false, 'User is created but it should not be created')
      },
      async count() {
        return 20
      }
    }
    const registrationService = new RegistrationService(
      fakeUserRepository,
      tokenService,
      fakeGravatarService(null)
    )
    try {
      await registrationService.createUser({
        email: userRecord.email, // same email
        username: 'test2',
        firstName: 'Test',
        lastName: 'Test'
      })
      assert.ok(false, 'There were no errors but there should be.')
    } catch (e) {
      assert.ok(e instanceof EmailIsAlreadyRegisteredError, e)
    }
  })

  // NOTE: The current auth flow does not tell us that the email is registered or not.
  // Unfortunately we cannot provide this for the username.
  // Afaik username is part of the requirements, therefore this test case:
  it('should throw error when username is registered', async () => {
    let userRecord = {
      email: 'test@test.com',
      username: 'test'
    }

    const fakeUserRepository = {
      findOne(query) {
        if (query.where.username == userRecord.username) {
          return userRecord
        } else {
          return null
        }
      },
      create(_data) {
        assert.ok(false, 'User is created but it should not be created')
      },
      async count() {
        return 20
      }
    }
    const registrationService = new RegistrationService(
      fakeUserRepository,
      tokenService,
      fakeGravatarService(null)
    )
    try {
      await registrationService.createUser({
        email: 'test2@test2.com', // different email
        username: userRecord.username, // same username
        firstName: 'Test',
        lastName: 'Test'
      })
      assert.ok(false, 'There were no errors but there should be.')
    } catch (e) {
      assert.ok(e instanceof UserNameIsAlreadyTakenError, e)
    }
  })

  it('should create user with gravatar if available and auth user', async () => {
    const profileURL = 'http.//something.com/me.jpg'
    const fakeUserRepository = {
      findOne(_query) {
        return null
      },
      create(data) {
        assert.equal(data.profileImgUrl, profileURL)
        return data
      },
      async count() {
        return 20
      }
    }
    const registrationService = new RegistrationService(
      fakeUserRepository,
      tokenService,
      fakeGravatarService(profileURL)
    )
    const token = await registrationService.createUser({
      email: 'test2@test2.com',
      username: 'test',
      firstName: 'Test',
      lastName: 'Test'
    })
    assert.equal(typeof token, 'string')
  })

  it('should create user without gravatar and auth user', async () => {
    const fakeUserRepository = {
      findOne(_query) {
        return null
      },
      create(data) {
        return data
      },
      async count() {
        return 20
      }
    }
    const registrationService = new RegistrationService(
      fakeUserRepository,
      tokenService,
      fakeGravatarService(null)
    )
    const token = await registrationService.createUser({
      email: 'test2@test2.com',
      username: 'test',
      firstName: 'Test',
      lastName: 'Test'
    })
    assert.equal(typeof token, 'string')
  })

  it('should not create the user when the limit is reached', async () => {
    const fakeUserRepository = {
      findOne(_query) {
        return null
      },
      create(data) {
        return data
      },
      async count() {
        return 200000
      }
    }
    const registrationService = new RegistrationService(
      fakeUserRepository,
      tokenService,
      fakeGravatarService(null)
    )
    try {
      await registrationService.createUser({
        email: 'test2@test2.com',
        username: 'test',
        firstName: 'Test',
        lastName: 'Test'
      })
      assert.ok(false)
    } catch (e) {
      assert.ok(e instanceof LimitReachedError)
    }
  })
})
