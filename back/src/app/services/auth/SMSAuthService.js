const { Logger } = require('../Logger')
const { MODE_2FA } = require('./TokenService')

class SMSAuthService {
  /**
   * @param {typeof import('sequelize').Model} userRepository
   * @param {import('../communication/SmsService').SmsService} smsService
   * @param {import('./TokenService').TokenService} tokenService
   */
  constructor(userRepository, smsService, tokenService) {
    this.__userRepository = userRepository
    this.__smsService = smsService
    this.__tokenService = tokenService
    this.__logger = new Logger('SMSAUthService')
  }

  /**
   * @param {string} email
   * @returns {Promise<void>}
   */
  async sendSMS(email) {
    const user = await this.__userRepository.findOne({ where: { email } })
    await this.__sendOneTimePasswordSMS(user.phoneNumber, email)
  }

  /**
   * @param {string} email
   * @param {string} phoneNumber
   * @returns {Promise<void>}
   */
  async sendSMSAndStoreNumber(email, phoneNumber) {
    const updateResult = await this.__userRepository.update(
      { phoneNumber },
      { where: { email } }
    )
    if (updateResult != 1) throw new Error('Unable to store phone number.')
    await this.__sendOneTimePasswordSMS(phoneNumber, email)
  }

  /**
   * @param {string} email
   * @param {string} smscode
   * @returns {Promise<string|null>} token if success, null if not
   */
  async authBySMS(email, smscode) {
    const user = await this.__userRepository.findOne({ where: { email } })
    const verified = user.smscode === smscode
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
   * @param {string} email
   * @param {string} smscode
   * @returns {Promise<boolean>} true if it was successful
   */
  async activateSMSAuth(email, smscode) {
    const user = await this.__userRepository.findOne({ where: { email } })
    const verified = user.smscode === smscode
    if (verified) {
      let result = await this.__userRepository.update(
        { enableSms: true },
        { where: { email } }
      )
      if (result != 1) throw new Error('Unable to activate SMS Auth')
      return true
    }
    return false
  }

  /**
   * @param {string} email
   * @returns {Promise<void>}
   */
  async deactivate(email) {
    let result = await this.__userRepository.update(
      { enableSms: false, smscode: '' },
      { where: { email } }
    )
    if (result != 1) throw new Error('Unable to deactivate SMS auth')
  }

  /**
   * Send OTP to the desired sms, and update user with the OTP
   * @param {string} destinationNumber phone number
   * @param {string} email
   * @returns {Promise<void>}
   */
  async __sendOneTimePasswordSMS(destinationNumber, email) {
    const OTP = this.__generateRandomNumber(1000, 9999)
    this.__logger.devLog('The SMS password was', OTP)
    const rawMessage =
      'Here is your SMS 2-factor authentication code for StrongNode : ' + OTP
    const updateResult = await this.__userRepository.update(
      { smscode: OTP },
      { where: { email } }
    )
    if (updateResult != 1) throw new Error('Unable to store OTP')
    await this.__smsService.send(destinationNumber, rawMessage)
  }

  __generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }
}

module.exports = {
  SMSAuthService
}
