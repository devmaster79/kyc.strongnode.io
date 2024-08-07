const jwt = require('jsonwebtoken')

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
 * the user should only have access to 2fa authentication
 * @readonly
 * @type {AuthMode}
 */
const MODE_2FA = { id: '2FA', expiresIn: '30m' }

/**
 * this auth mode is for the dVPN product only.
 * @type {{expiresIn: string, id: string}}
 */
const MODE_DVPN = { id: 'DVPN', expiresIn: '168h' }

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
    const enable_2fa =
      user.enablePassword || user.enableAuthenticator || user.enableSms
    const mode_2fa_if_enabled = enable_2fa ? [MODE_2FA] : []

    // When the current mode is completed, what will be the next.
    const flow =
      currentMode == MODE_REGISTRATION
        ? [MODE_REGISTRATION, MODE_FULL]
        : [MODE_GUEST, ...mode_2fa_if_enabled, MODE_FULL]

    const currentIndex = flow.findIndex((mode) => currentMode.id === mode.id)
    let nextMode
    if (flow[currentIndex + 1]) {
      nextMode = flow[currentIndex + 1]
    } else {
      nextMode = flow[currentIndex]
    }
    return nextMode
  }

  /**
   * Generate token that the auth middleware could understand
   * @param {string} email
   * @param {string|null} username null when the jwt is created for registration
   * @param {string|null} userLevel null when the jwt is created for registration
   * @param {AuthMode} mode
   * @param {string} expiresIn e.g: 30m
   * @returns {string}
   */
  generateToken(email, username, userLevel, mode) {
    const jwt_data = { email, username, level: userLevel }
    const secret = this.__getTokenSecret(mode)
    return jwt.sign(jwt_data, secret, { expiresIn: mode.expiresIn })
  }

  /**
   * Checks if the token is valid for at least one of the modes
   * @param {string} token
   * @param {AuthMode[]} listOfModes
   * @returns {{ email: string, username: string }|null} null if the token is invalid
   */
  decode(token, listOfModes) {
    for (let authMode of listOfModes) {
      try {
        return jwt.verify(token, this.__getTokenSecret(authMode))
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
    return mode.id + process.env.TOKEN_SECRET
  }
}

module.exports = {
  TokenService,
  MODE_GUEST,
  MODE_REGISTRATION,
  MODE_2FA,
  MODE_FULL,
  MODE_DVPN
}
