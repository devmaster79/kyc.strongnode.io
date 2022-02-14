const jwt = require("jsonwebtoken");

/**
 * @param {('QR'|'SMS'|'')[]} token_secret_modes type of auth middlewere
 */
const verifyToken = (...token_secret_modes) => (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  // find valid token with the allowed modes
  let valid_token_found = false;
  for(let token_secret_mode of token_secret_modes) {
    try {
      const decoded = jwt.verify(token, getTokenSecret(token_secret_mode));
      req.user = decoded;
      valid_token_found = true;
      break;
    } finally {
      // do_nothing
    }
  }

  if(!valid_token_found) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

/**
 * @param {'QR'|'SMS'|''} mode
 * @returns {string}
 */
const getTokenSecret = (mode) => {
  return mode + process.env.TOKEN_SECRET;
}

module.exports = verifyToken;
module.exports.getTokenSecret = getTokenSecret;

/** the user should only have access to qr sign in */
module.exports.MODE_QR = 'QR';
module.exports.MODE_QR_EXPIRES_IN = '30m'
/** the user should only have access to sms sign in */
module.exports.MODE_SMS = 'SMS';
module.exports.MODE_SMS_EXPIRES_IN = '30m'
/** both first and all 2fa methods completed (if needed) */
module.exports.MODE_FULL = '';
module.exports.MODE_FULL_EXPIRES_IN = '168h'