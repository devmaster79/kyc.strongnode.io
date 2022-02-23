const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

/**
 * const for salting password hashes, more than 10 makes it really slow on localhost
 * @type {number}
 */
const saltRounds = 10;

/**
 * Method that generates hash for specific password using bcrypt
 * @returns {Promise<boolean>}
 */
exports.generateHashBcrypt = async (password) => {
  // return empty strings
  if (password === '') return false;

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt).then((hash) => {
    return hash;
  });

  return hash;
};

/**
 * Method that verifies hash againsts password.
 * @param hash
 * @param password
 * @returns {Promise<boolean>}
 */
exports.verifyPasswordHash = async (hash, password) => {
  return await bcrypt.compare(password, hash).then((res) => {
    return res;
  });
};

/**
 * Method that has about the same execution time as verifyPasswordHash
 * It will always fail
 * @param hash
 * @param password
 * @returns {Promise<boolean>}
 */
exports.fakeVerifyPasswordHash = async () => {
  return await exports.verifyPasswordHash(
    // something in hash:
    "7f33f5ad070f257e52d7bcdab12effe4771f6703ac8ecc7761dc7de6e932f444",
    "somethingelse"
  )
};
