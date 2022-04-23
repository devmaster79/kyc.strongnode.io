const speakeasy = require('@levminer/speakeasy');
const QRCode = require('qrcode');
const { MODE_2FA } = require('./TokenService');

class AuthenticatorAuthService {
    /**
     * @param {typeof import('sequelize').Model} userRepository
     * @param {import('./TokenService').TokenService} tokenService
     */
    constructor(userRepository, tokenService) {
        this.__userRepository = userRepository
        this.__tokenService = tokenService;
    }

    /**
     * Generate a secret that will be only available as QR form for the signed in user
     * when he is registering a new authenticator
     *
     * @param {string} email
     * @returns {Promise<string|null>} qrcode image
     */
    async generateQRCode(email) {
        const secret = speakeasy.generateSecret({ name: "StrongNode" });
        const qrcode = await QRCode.toDataURL(secret.otpauth_url);

        const data = { authenticator_qr_secret: secret.base32 };
        const result = await this.__userRepository.update(data, { where: { email } });
        if(result != 1) throw new Error('Unable to generate QR code');
        return qrcode;
    }

    /**
     * Turn on Authenticator authentication
     * @param {string} email
     * @param {string} token
     * @returns {Promise<boolean>}
     */
    async activateAuthenticatorAuth(email, token) {
        const user = await this.__userRepository.findOne({ where: { email } });
        const verified = speakeasy.totp.verify({
            secret: user.authenticator_qr_secret,
            encoding: "base32",
            token,
        });
        if (verified) {
            const result = await this.__userRepository.update(
                { enable_authenticator: true },
                { where: { email }
            });
            if(result != 1) throw new Error("Unable to activate Authenticator auth");
            return true;
        }
        return false;
    }

    /**
     * Turn off Authenticator authentication
     * @param {string} email
     * @returns {Promise<void>}
     */
    async deactivateAuthenticatorAuth(email) {
        const result = await this.__userRepository.update(
            { enable_authenticator: false },
            { where: { email }
        });
        if(result != 1) throw new Error("Unable to deactivate Authenticator auth");
    }

    /**
     * Verify the token from a registered authenticator.
     * @param {string} email
     * @param {string} token
     * @returns {Promise<string|null>} token if success, null if not
     */
    async authByAuthenticator(email, token) {
        const user = await this.__userRepository.findOne({ where: { email } });
        const verified = speakeasy.totp.verify({
            secret: user.authenticator_qr_secret,
            encoding: "base32",
            token,
        });
        if (verified) {
            const mode = this.__tokenService.determineNextMode(user, MODE_2FA);
            const token = this.__tokenService.generateToken(user.email, user.user_name, mode);
            return token;
        }
        return null
    }
}

module.exports = {
    AuthenticatorAuthService
}