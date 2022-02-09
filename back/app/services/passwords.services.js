const dotenv = require("dotenv")
const bcrypt = require("bcryptjs");
dotenv.config()

const saltRounds = 1000

/**
 * Method that generates hash for specific password using bcrypt
 * @returns {Promise<void>}
 */
exports.generateHashBcrypt = async (password) => {
    // generates hash, with a random selected salt
    let hash = await bcrypt.genSalt(saltRounds).then(async (salt) => {
        return await bcrypt.hash(password, salt).then((hash) => {
            return hash
        })
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
