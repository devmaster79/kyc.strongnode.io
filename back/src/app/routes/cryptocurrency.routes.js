const { MODE_FULL, MODE_GUEST } = require("../services/auth/TokenService.js");
const cryptocurrency = require("../controllers/cryptocurrency.controller");
const auth = require("../middleware/auth");

module.exports = (app) => {
  const router = require("express").Router();

  // Create a new History
  router.get("/", cryptocurrency.getTokenData);
  router.get("/chart", auth(MODE_FULL), cryptocurrency.getTokenData)

  app.use("/api/cryptocurrency", router);
};
