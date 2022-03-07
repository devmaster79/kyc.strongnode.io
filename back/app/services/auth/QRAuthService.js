const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { MODE_QR } = require('./TokenService');

class QRAuthService {
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

        const data = { qr_secret: secret.base32 };
        const result = await this.__userRepository.update(data, { where: { email } });
        if(result != 1) throw new Error('Unable to generate QR code');
        return qrcode;
    }

    /**
     * Turn on QR authentication
     * @param {string} email
     * @param {string} token
     * @returns {Promise<boolean>}
     */
    async activateQrAuth(email, token) {
        const user = await this.__userRepository.findOne({ where: { email } });
        const verified = speakeasy.totp.verify({
            secret: user.qr_secret,
            encoding: "base32",
            token,
        });
        if (verified) {
            const result = await this.__userRepository.update(
                { enable_qr: true },
                { where: { email }
            });
            if(result != 1) throw new Error("Unable to activate QR auth");
            return true;
        }
        return false;
    }

    /**
     * Turn off QR authentication
     * @param {string} email
     * @returns {Promise<void>}
     */
    async deactivateQrAuth(email) {
        const result = await this.__userRepository.update(
            { enable_qr: false },
            { where: { email }
        });
        if(result != 1) throw new Error("Unable to activate QR auth");
    }

    /**
     * Verify the token from a registered authenticator.
     * @param {string} email
     * @param {string} token
     * @returns {Promise<string|null>} token if success, null if not
     */
    async authByQR(email, token) {
        const user = await this.__userRepository.findOne({ where: { email } });
        const verified = speakeasy.totp.verify({
            secret: user.qr_secret,
            encoding: "base32",
            token,
        });
        if (verified) {
            const mode = this.__tokenService.determineNextMode(user, MODE_QR);
            const token = this.__tokenService.generateToken(user.email, user.user_name, mode);
            return token;
        }
        return null
    }
}

module.exports = {
    QRAuthService
}