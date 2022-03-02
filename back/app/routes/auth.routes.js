const { MODE_REGISTRATION, MODE_PASSWORD, MODE_FULL, MODE_QR, MODE_SMS } = require("../services/auth/TokenService.js");
const authController = require("../controllers/auth.controller.js");
const auth = require("../middleware/auth");
const { sendSMSLimit, authOTPLimit, authPasswordLimit } = require("../middleware/limits.js");

module.exports = (app) => {
  const router = require("express").Router();

  // Send a new email with the registration or login link
  router.post("/sendVerificationEmail", authController.sendVerificationEmail);

  // Create a new user
  router.post("/register", auth(MODE_REGISTRATION), authController.register);

  // Password authentication
  router.post("/enablePasswordAuth", auth(MODE_FULL), authController.enablePasswordAuth);
  router.post("/disablePasswordAuth", auth(MODE_FULL), authController.disablePasswordAuth);
  router.post(
    "/authByPassword",
    auth(MODE_PASSWORD),
    authPasswordLimit.limiter,
    authPasswordLimit.resolver,
    authController.authByPassword
  );

  // SMS authentication
  router.post(
    "/sendSMSToUser",
    auth(MODE_SMS),
    sendSMSLimit.limiter,
    authController.sendSMSToUser
  );
  router.post(
    "/authBySMSCode",
    auth(MODE_SMS),
    authOTPLimit.limiter,
    authOTPLimit.resolver,
    sendSMSLimit.resolver,
    authController.authBySMSCode
  );
  router.post(
    "/sendSMSAndSaveNumber",
    auth(MODE_FULL),
    sendSMSLimit.limiter,
    authController.sendSMSAndSaveNumber
  );
  router.post(
    "/enableSMSAuth",
    auth(MODE_FULL),
    sendSMSLimit.resolver,
    authController.enableSMSAuth
  );
  router.post(
    "/disableSMSAuth",
    auth(MODE_FULL),
    authController.disableSMSAuth
  );

  // QR authentication
  router.post(
    "/authByQRCode",
    auth(MODE_QR),
    authOTPLimit.limiter,
    authOTPLimit.resolver,
    authController.authByQRCode
  );
  router.post("/generateQRCode", auth(MODE_FULL), authController.generateQRCode);
  router.post("/enableQRAuth", auth(MODE_FULL), authController.enableQRAuth);
  router.post("/disableQRAuth", auth(MODE_FULL), authController.disableQRAuth);

  app.use("/api/auth", router);
};
