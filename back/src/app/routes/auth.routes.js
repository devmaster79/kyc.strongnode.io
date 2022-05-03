const { MODE_REGISTRATION, MODE_FULL, MODE_2FA } = require("../services/auth/TokenService.js");
const authController = require("../controllers/auth.controller");
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
    auth(MODE_2FA),
    authPasswordLimit.limiter,
    authPasswordLimit.resolver,
    authController.authByPassword
  );

  // SMS authentication
  router.post(
    "/sendSMSToUser",
    auth(MODE_2FA),
    sendSMSLimit.limiter,
    authController.sendSMSToUser
  );
  router.post(
    "/authBySMSCode",
    auth(MODE_2FA),
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

  // Authenticator authentication
  router.post(
    "/authByAuthenticator",
    auth(MODE_2FA),
    authOTPLimit.limiter,
    authOTPLimit.resolver,
    authController.authByAuthenticator
  );
  router.post("/generateAuthenticatorQRCode", auth(MODE_FULL), authController.generateAuthenticatorQRCode);
  router.post("/enableAuthenticatorAuth", auth(MODE_FULL), authController.enableAuthenticatorAuth);
  router.post("/disableAuthenticatorAuth", auth(MODE_FULL), authController.disableAuthenticatorAuth);

  app.use("/api/auth", router);
};
