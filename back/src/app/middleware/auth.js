const { TokenService } = require('../services/auth/TokenService');

/**
 * @param {import('../services/auth/TokenService').AuthMode[]} authModes type of auth middlewere
 */
const verifyToken = (...authModes) => (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const tokenService = new TokenService();

  let decoded = tokenService.decode(token, authModes);
  if (!decoded) {
    return res.status(401).send({ result: 'unauthorized-error' });
  }
  req.user = decoded;
  return next();
};

module.exports = verifyToken;
