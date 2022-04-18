const { MODE_FULL, MODE_GUEST } = require("../services/auth/TokenService.js");
const cryptocurrency = require("../controllers/cryptocurrency.controller");
const auth = require("../middleware/auth");

module.exports = (app) => {
  const router = require("express").Router();

  router.get("/", cryptocurrency.refreshTokenDataList);

  // routes for refreshing token data
  router.get("/refresh-strongnode-token", cryptocurrency.refreshStrongnodeTokenData);
  router.get("/refresh-tokens", cryptocurrency.refreshTokenDataList);
  router.get("/chart", auth(MODE_FULL), cryptocurrency.getTokenChartData)
  router.get("/token-metrics", cryptocurrency.getTokensMetrics)

  app.use("/api/cryptocurrency", router);
};
