const dotenv = require("dotenv");

dotenv.config();

exports.syncEmailTemplates = async (req, res) => {
    const createTemplate = require('../scripts/create-template')
    const updateTemplate = require('../scripts/update-template')
    res.send('success')
}
