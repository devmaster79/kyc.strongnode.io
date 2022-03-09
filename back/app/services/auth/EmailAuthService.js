const {
    MODE_GUEST,
    MODE_REGISTRATION,
    MODE_QR,
    MODE_SMS,
    MODE_PASSWORD,
    MODE_FULL,
} = require('./TokenService');
const routes = require("shared/routes");
const { emailTemplatesNames } = require('../communication.services')
const path = require('path');

class EmailAuthService {
    /**
     * @param {typeof import('sequelize').Model} userRepository
     * @param {import('../communication.services')} communicationService
     * @param {import('./TokenService').TokenService} tokenService
     */
    constructor(userRepository, communicationService, tokenService) {
        this.__userRepository = userRepository
        this.__communicationService = communicationService
        this.__tokenService = tokenService
    }

    /**
     * send email with link for the next step
     * if not registered -> signin link
     * if registered -> signup link
     * @param {string} email
     */
    async sendVerificationEmail(email) {
        email = email.toLowerCase();
        let link;
        try {
            const user = await this.__userRepository.findOne({ where: { email } });
            const mode = this.__tokenService.determineNextMode(user, MODE_GUEST);
            const token = this.__tokenService.generateToken(email, user.user_name, mode);
            link = this.__getURL(mode, token);
        } catch (_) {
            const mode = MODE_REGISTRATION;
            const token = this.__tokenService.generateToken(email, null, mode);
            link = this.__getURL(mode, token);
        }
        await this.__communicationService.sendTemplatedEmail(
            email,
            { link },
            emailTemplatesNames.confirmEmail
        );
    }

    /**
     * @param {import("./TokenService").AuthMode} mode
     * @returns {string}
     */
    __getURL(mode, token) {
        return (new URL(this.__getRoute(mode, token), process.env.FRONTEND_URL)).href;
    }

    /**
     * @param {import("./TokenService").AuthMode} mode
     * @returns {string}
     */
    __getRoute(mode, token) {
        switch (mode.id) {
            case MODE_GUEST.id:
                return ''
            case MODE_REGISTRATION.id:
                return `${routes.REGISTER}?token=${token}`
            case MODE_QR.id:
                return `${routes.SIGN_IN_WITH_AUTHENTICATOR}?token=${token}`
            case MODE_SMS.id:
                return `${routes.SIGN_IN_WITH_SMS}?token=${token}`
            case MODE_PASSWORD.id:
                return `${routes.SIGN_IN_WITH_PASSWORD}?token=${token}`
            case MODE_FULL.id:
                return `${routes.SIGN_IN_WITH_TOKEN}?token=${token}`
            default:
                throw "Unexpected mode.id: " + mode.id
        }
    }
}

module.exports = {
    EmailAuthService
};