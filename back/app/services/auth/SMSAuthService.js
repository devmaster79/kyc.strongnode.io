const { MODE_SMS } = require('./TokenService')

class SMSAuthService {

    /**
     * @param {typeof import('sequelize').Model} userRepository
     * @param {import('../communication.services')} communicationService
     * @param {import('./TokenService').TokenService} tokenService
     */
    constructor(userRepository, communicationService, tokenService) {
        this.__userRepository = userRepository;
        this.__communicationService = communicationService;
        this.__tokenService = tokenService;
    }

    /**
     * @param {string} email
     * @returns {Promise<void>}
     */
    async sendSMS(email) {
        const user = await this.__userRepository.findOne({ where: { email } });
        await this.__sendOneTimePasswordSMS(user.phone_number, email)
    }

    /**
     * @param {string} email
     * @param {string} phone_number
     * @returns {Promise<void>}
     */
    async sendSMSAndStoreNumber(email, phone_number) {
        await this.__userRepository.update(
            { phone_number },
            { where: { email } }
        );
        await this.__sendOneTimePasswordSMS(phone_number, email)
    }

    /**
     * @param {string} email
     * @param {string} smscode
     * @returns {Promise<string|null>} token if success, null if not
     */
    async authBySMS(email, smscode) {
        const user = await this.__userRepository.findOne({ where: { email } });
        const verified = user.smscode === smscode;
        if (verified) {
            const mode = this.__tokenService.determineNextMode(user, MODE_SMS);
            const token = this.__tokenService.generateToken(user.email, user.user_name, mode);
            return token;
        }
        return null;
    }

    /**
     * @param {string} email
     * @param {string} smscode
     * @returns {Promise<boolean>} true if it was successful
     */
    async activateSMSAuth(email, smscode) {
        const user = await this.__userRepository.findOne({ where: { email } });
        const verified = user.smscode === smscode;
        if (verified) {
            let result = await this.__userRepository.update(
                { enable_sms: true },
                { where: { email } }
            );
            return result == 1;
        }
        return false
    }

    /**
     * @param {string} email
     * @returns {Promise<boolean>}
     */
    async deactivate(email) {
        let result = await this.__userRepository.update(
            { enable_sms: false, smscode: '' },
            { where: { email } }
        );
        return result == 1;
    }

    /**
     * Send OTP to the desired sms, and update user with the OTP
     * @param {string} destinationNumber phone number
     * @param {string} email
     * @returns {Promise<void>}
     */
    async __sendOneTimePasswordSMS(destinationNumber, email) {
        const OTP = this.__generateRandomNumber(1000, 9999);
        const message = "Here is your SMS 2-factor authentication code for StrongNode : " + OTP;
        await this.__userRepository.update({ smscode: OTP }, { where: { email } });
        await this.__communicationService.sendSms(destinationNumber, message);
    }

    __generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

module.exports = {
    SMSAuthService,
};