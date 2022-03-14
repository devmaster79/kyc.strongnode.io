module.exports = (app) => {
    const router = require("express").Router();
    const utils = require('../controllers/utils.controller')

    router.get("/refreshEmailTemplates", utils.syncEmailTemplates);

    app.use("/api/utils", router);
}
