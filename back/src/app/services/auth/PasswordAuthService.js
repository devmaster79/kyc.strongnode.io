const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
dotenv.config()
const { MODE_2FA } = require('./TokenService')

/**
 * const for salting password hashes, more than 10 makes it really slow on localhost
 * @type {number}
 */
const SALT_ROUNDS = 10

class PasswordAuthService {
  /**
   * @param {typeof import('sequelize').Model} userRepository
   * @param {import('./TokenService').TokenService} tokenService
   */
  constructor(userRepository, tokenService) {
    this.__userRepository = userRepository
    this.__tokenService = tokenService
  }

  /**
   * Validates password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<string|null>} token if success, null if not
   */
  async authByPassword(email, password) {
    const user = await this.__userRepository.findOne({ where: { email } })
    if (!user.password) return null
    const verified = await this.__verifyPasswordHash(user.password, password)
    if (verified) {
      const mode = this.__tokenService.determineNextMode(user, MODE_2FA)
      return this.__tokenService.generateToken(
        user.email,
        user.username,
        user.level,
        mode
      )
    }
    return null
  }

  /**
   * Turns on password authentication
   * @param {string} email
   * @param {string} password
   * @returns {Promise<void>}
   */
  async setPassword(email, password) {
    const hash = await this.__generateHashBcrypt(password)
    const result = await this.__userRepository.update(
      {
        password: hash,
        enablePassword: true
      },
      { where: { email } }
    )
    if (result != 1) throw new Error('Unable to set password.')
  }

  /**
   * Turns off password authentication
   * @param {string} email
   * @returns {Promise<void>}
   */
  async removePassword(email) {
    const result = await this.__userRepository.update(
      {
        password: '',
        enablePassword: false
      },
      { where: { email } }
    )
    if (result != 1) throw new Error('Unable to remove password.')
  }

  /**
   * Method that generates hash for specific password using bcrypt
   * @returns {Promise<string>}
   */
  async __generateHashBcrypt(password) {
    // return empty strings
    if (password === '') return false

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    return await bcrypt.hash(password, salt).then((hash) => {
      return hash
    })
  }

  /**
   * Method that verifies hash againsts password.
   * @param {string} hash
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async __verifyPasswordHash(hash, password) {
    return await bcrypt.compare(password, hash).then((res) => {
      return res
    })
  }

  /**
   * Method that has about the same execution time as verifyPasswordHash
   * It will always fail
   * @param hash
   * @param password
   * @returns {Promise<boolean>}
   */
  async __fakeVerifyPasswordHash() {
    return await exports.verifyPasswordHash(
      // something in hash:
      '7f33f5ad070f257e52d7bcdab12effe4771f6703ac8ecc7761dc7de6e932f444',
      'somethingelse'
    )
  }
}

module.exports = {
  PasswordAuthService
}
