const md5 = require("md5");
const axios = require('axios');

class GravatarService {
    /**
     * Get gravatar
     * @param {string} email
     * @returns {Promise<string | null>} url
     */
     async getProfileImageURL(email) {
        const email_md5 = md5(email.trim().toLowerCase());
        const url = "http://www.gravatar.com/avatar/" + email_md5 + "?d=404";
        try {
            const res = await axios.get(url);
            return res.config.url;
        } catch (err) {
            return null;
        }
    }
}

module.exports = {
    GravatarService
}