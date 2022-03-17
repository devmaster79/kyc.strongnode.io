const db = require('../models');
const User = db.users;

const usersPublicData = ['email', 'first_name', 'enable_authenticator', 'enable_sms', 'user_name'];

/**
 * Method that returns public data of our user.
 * In order to work with them on FE.
 * Helper function.
 * @param userWhere
 * @returns {Promise<void>}
 */
exports.getUsersPublicData = async (userWhere) => {
  return await User.findOne({ where: userWhere, attributes: usersPublicData });
};
