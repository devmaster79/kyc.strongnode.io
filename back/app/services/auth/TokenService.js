const jwt = require("jsonwebtoken");

/**
* @typedef AuthMode
* @property {string} id
* @property {string} expiresIn
*/

/**
 * This is a formal "state" that is not used for token creation,
 * but useful for telling functions the current auth state.
 * @readonly
 * @type {AuthMode}
 */
const MODE_GUEST = { id: 'GUEST', expiresIn: '1d' }
/**
 * the user should only have access to the registration
 * @readonly
 * @type {AuthMode}
 */
const MODE_REGISTRATION = { id: 'REGISTRATION', expiresIn: '30m' }
/**
 * the user should only have access to the qr authentication
 * @readonly
 * @type {AuthMode}
 */
const MODE_QR = { id: 'QR', expiresIn: '30m' }
/**
 * the user should only have access to the sms authentication
 * @readonly
 * @type {AuthMode}
 */
const MODE_SMS = { id: 'SMS', expiresIn: '30m' }
/**
 * the user should only have access to the password authentication
 * @readonly
 * @type {AuthMode}
 */
const MODE_PASSWORD = { id: 'PASSWORD', expiresIn: '30m' }
/**
 * both first and all 2fa methods completed (if needed)
 * @readonly
 * @type {AuthMode}
 */
const MODE_FULL = { id: 'FULL', expiresIn: '168h' }

class TokenService {
    /**
     * Progress the auth flow by one step
     * @param {Object} user
     * @param {AuthMode} currentMode
     * @returns {AuthMode}
     */
    determineNextMode(user, currentMode) {
        const password_mode_if_enabled = user.enable_password ? [MODE_PASSWORD] : [];
        const qr_mode_if_enabled = user.enable_qr ? [MODE_QR] : [];
        const sms_mode_if_enabled = user.enable_sms ? [MODE_SMS] : [];
        const flow = currentMode == MODE_REGISTRATION ? [
            MODE_REGISTRATION,
            MODE_FULL
        ] : [
            MODE_GUEST,
            ...password_mode_if_enabled,
            ...qr_mode_if_enabled,
            ...sms_mode_if_enabled,
            MODE_FULL
        ];

        const currentIndex = flow.findIndex(mode => currentMode.id === mode.id);
        let nextMode;
        if (flow[currentIndex + 1]) {
            nextMode = flow[currentIndex + 1];
        } else {
            nextMode = flow[currentIndex];
        }
        return nextMode
    }

    /**
     * Generate token that the auth middleware could understand
     * @param {string} email
     * @param {string} userName
     * @param {AuthMode} mode
     * @param {string} expiresIn e.g: 30m
     * @returns {string}
     */
    generateToken(email, userName, mode) {
        const jwt_data = { email, user_name: userName };
        const secret = this.__getTokenSecret(mode);
        return jwt.sign(jwt_data, secret, { expiresIn: mode.expiresIn });
    }

    /**
     * Checks if the token is valid for at least one of the modes
     * @param {string} token
     * @param {AuthMode[]} listOfModes
     * @returns {{ email: string, user_name: string }|null} null if the token is invalid
     */
    decode(token, listOfModes) {
        for (let authMode of listOfModes) {
            try {
                const decoded = jwt.verify(token, this.__getTokenSecret(authMode));
                return decoded;
            } catch (_error) {
                // do_nothing
            }
        }

        return null
    }

    /**
     * Get a secret for encrypting.
     * Different modes produces different secrets.
     * @param {AuthMode} mode
     * @returns {string}
     */
    __getTokenSecret(mode) {
        return mode.id + process.env.TOKEN_SECRET;
    }
}

module.exports = {
    TokenService,
    MODE_GUEST,
    MODE_REGISTRATION,
    MODE_QR,
    MODE_SMS,
    MODE_PASSWORD,
    MODE_FULL,
}