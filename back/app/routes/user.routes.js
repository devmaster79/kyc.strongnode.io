module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middleware/auth");
  const { MODE_FULL, MODE_QR, MODE_SMS } = auth;
  const multer = require('multer')
  const upload = multer({ dest: 'uploads/' })
  const router = require("express").Router();
  const { sendSMSLimit, authOTPLimit, authPasswordLimit } = require("../middleware/limits.js");

  // Create a new User
  router.post("/", users.create);
  router.put("/verifyEmail", users.verifyEmail);
  router.put("/createPassword", users.createPassword);
  router.put("/createInvestor", auth(MODE_FULL), users.createInvestor);

  // Request a password reset
  router.post("/passwordReset", users.requestPasswordReset);

  // Submit a password reset
  router.post("/passwordResetSubmit", users.resetPassword);

  // Password authentication
  router.put(
    "/signin",
    authPasswordLimit.limiter,
    authPasswordLimit.resolver,
    users.signin
  );

  // SMS authentication
  router.post(
    "/sms/send",
    auth(MODE_SMS),
    sendSMSLimit.limiter,
    users.sendSMS
  );
  router.post(
    "/sms/auth",
    auth(MODE_SMS),
    authOTPLimit.limiter,
    authOTPLimit.resolver,
    sendSMSLimit.resolver,
    users.authSMS
  );
  router.post(
    "/sms/testSend",
    auth(MODE_FULL),
    sendSMSLimit.limiter,
    users.sendSMS
  );
  router.post(
    "/sms/testAuth",
    auth(MODE_FULL),
    sendSMSLimit.resolver,
    users.testAuthSMS
  );

  // QR authentication
  router.post(
    "/qr/auth",
    auth(MODE_QR),
    authOTPLimit.limiter,
    authOTPLimit.resolver,
    users.authQR
  );
  router.post("/qr/generate", auth(MODE_FULL), users.generateQR);
  router.get("/qr/testAuth", auth(MODE_FULL), users.testAuthQR);

  //profile
  router.get("/profile", auth(MODE_FULL), users.getProfile);
  router.post("/profile", auth(MODE_FULL), users.createProfile);
  router.put("/profile", auth(MODE_FULL), users.updateProfile);

  //upload image to s3
  router.put("/profile/image", auth(MODE_FULL), upload.single('image_data'), users.uploadImg);

  app.use("/api/users", router);
};
