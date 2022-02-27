const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();
const { MODE_PASSWORD } = require('./TokenService');

/**
 * const for salting password hashes, more than 10 makes it really slow on localhost
 * @type {number}
 */
const SALT_ROUNDS = 10;


class PasswordAuthService {
  /**
   * @param {typeof import('sequelize').Model} userRepository
   * @param {import('./TokenService').TokenService} tokenService
   */
  constructor(userRepository, tokenService) {
    this.__userRepository = userRepository
    this.__tokenService = tokenService;
  }

  /**
   * Validates password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<string|null>} token if success, null if not
   */
  async authByPassword(email, password) {
    const user = await this.__userRepository.findOne({ where: { email } });
    const verified = await this.__verifyPasswordHash(user.password, password);
    if (verified) {
      const mode = this.__tokenService.determineNextMode(user, MODE_PASSWORD);
      const token = this.__tokenService.generateToken(user.email, user.user_name, mode);
      return token;
    }
    return null;
  }

  /**
   * Turns on password authentication
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async setPassword(email, password) {
    const hash = await this.__generateHashBcrypt(password);
    const result = await this.__userRepository.update({
      password: hash,
      enable_password: true
    }, { where: { email } });
    if (result == 1) {
      return true
    } else {
      return false
    }
  }

  /**
   * Turns off password authentication
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async removePassword(email) {
    const result = await this.__userRepository.update({
      password: '',
      enable_password: false
    }, { where: { email } });
    if (result == 1) {
      return true
    } else {
      return false
    }
  }

  /**
   * Method that generates hash for specific password using bcrypt
   * @returns {Promise<boolean>}
   */
  async __generateHashBcrypt(password) {
    // return empty strings
    if (password === '') return false;

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt).then((hash) => {
      return hash;
    });

    return hash;
  };

  /**
   * Method that verifies hash againsts password.
   * @param hash
   * @param password
   * @returns {Promise<boolean>}
   */
  async __verifyPasswordHash(hash, password) {
    return await bcrypt.compare(password, hash).then((res) => {
      return res;
    });
  };

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
      "7f33f5ad070f257e52d7bcdab12effe4771f6703ac8ecc7761dc7de6e932f444",
      "somethingelse"
    )
  };
}

module.exports = {
  PasswordAuthService
};