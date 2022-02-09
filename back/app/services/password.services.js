const dotenv = require("dotenv")
const bcrypt = require("bcryptjs");
dotenv.config()

/**
 * const for salting password hashes, more than 10 makes it really slow on localhost
 * @type {number}
 */
const saltRounds = 10

/**
 * Method that generates hash for specific password using bcrypt
 * @returns {Promise<boolean>}
 */
exports.generateHashBcrypt = async (password) => {
    // return empty strings
    if (password === '')
        return false

    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt).then((hash) => {
        return hash
    })

    return hash
}

/**
 * Method that verifies hash againsts password.
 * @param hash
 * @param password
 * @returns {Promise<void>}
 */
exports.verifyPasswordHash = async (hash, password) => {
    return await bcrypt.compare(password, hash).then((err, res) => {
        return res
    })
}
