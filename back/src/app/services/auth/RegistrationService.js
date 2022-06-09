const { REGISTRATION_LIMIT } = require('app/config/config')
const { MODE_REGISTRATION } = require('./TokenService')

class RegistrationService {
  /**
   * @param {typeof import('sequelize').Model} userRepository
   * @param {import('./TokenService').TokenService} tokenService
   * @param {import('../GravatarService').GravatarService} gravatarService
   */
  constructor(userRepository, tokenService, gravatarService) {
    this.__userRepository = userRepository
    this.__tokenService = tokenService
    this.__gravatarService = gravatarService
  }

  /**
   * Create a new user
   * @param {Object} props
   * @param {string} props.email
   * @param {string} props.username
   * @param {string} props.firstName
   * @param {string} props.lastName
   *
   * @throws {EmailIsAlreadyRegisteredError}
   * @throws {UserNameIsAlreadyTakenError}
   *
   * @returns {Promise<string>} access token to the dashboard
   */
  async createUser(props) {
    if (await this.__isEmailRegistered(props.email)) {
      // NOTE: this case couldn't happen,
      // because if email is registered user will only see the login screen or dashboard.
      throw new EmailIsAlreadyRegisteredError()
    }
    if (await this.__isUserNameRegistered(props.username)) {
      throw new UserNameIsAlreadyTakenError()
    }
    if (await this.__isLimitReached()) {
      throw new LimitReachedError()
    }
    const profileImgUrl = await this.__gravatarService.getProfileImageURL(
      props.email
    )
    const user = await this.__userRepository.create({
      email: props.email,
      username: props.username,
      firstName: props.firstName,
      lastName: props.lastName,
      enableAuthenticator: false,
      enablePassword: false,
      enableSms: false,
      ...(profileImgUrl ? { profileImgUrl } : {})
    })
    if (!user) throw new new UnableToCreateUserError()()
    const nextMode = this.__tokenService.determineNextMode(
      user,
      MODE_REGISTRATION
    )
    return this.__tokenService.generateToken(
      user.email,
      user.username,
      nextMode
    )
  }

  /**
   * Check whether the email exists or not
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async __isEmailRegistered(email) {
    const user = await this.__userRepository.findOne({ where: { email } })
    return !!user
  }

  /**
   * Check whether the username exists or not
   * @param {string} username
   * @returns {Promise<boolean>}
   */
  async __isUserNameRegistered(username) {
    const user = await this.__userRepository.findOne({ where: { username } })
    return !!user
  }

  /**
   * Check whether the registration limit is reached or not
   * @returns {Promise<boolean>}
   */
  async __isLimitReached() {
    const number_of_users = await this.__userRepository.count()
    return number_of_users >= REGISTRATION_LIMIT
  }
}

/**
 * Please do not share this error with users
 */
class EmailIsAlreadyRegisteredError extends Error {
  constructor() {
    super('Email is already registered.')
  }
}

class UserNameIsAlreadyTakenError extends Error {
  constructor() {
    super('Email is already registered.')
  }
}

class UnableToCreateUserError extends Error {
  constructor() {
    super('Unable to create user.')
  }
}

class LimitReachedError extends Error {
  constructor() {
    super('Maximum number of users reached')
  }
}

module.exports = {
  RegistrationService,
  EmailIsAlreadyRegisteredError,
  UserNameIsAlreadyTakenError,
  UnableToCreateUserError,
  LimitReachedError
}
