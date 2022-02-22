module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middleware/auth");
  const { MODE_FULL, MODE_QR, MODE_SMS } = auth;
  const multer = require('multer')
  const upload = multer({ dest: 'uploads/' })
  const router = require("express").Router();
  const { sendSMSLimit, authSMSLimit } = require("../middleware/limits.js");

  // Create a new User
  router.post("/", users.create);
  router.put("/verifyEmail", users.verifyEmail);
  router.put("/createPassword", users.createPassword);
  router.put("/createProfile", auth(MODE_FULL), users.createProfile);
  router.put("/createInvestor", auth(MODE_FULL), users.createInvestor);

  // Request a password reset
  router.post("/passwordReset", users.requestPasswordReset);

  // Submit a password reset
  router.post("/passwordResetSubmit", users.resetPassword);

  // Password authentication
  router.put("/signin", users.signin);

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
    authSMSLimit.limiter,
    authSMSLimit.resolver,
    sendSMSLimit.resolver,
    users.authSMS
  );
  router.post(
    "/sms/testSend",
    auth(MODE_FULL),
    sendSMSLimit.limiter,
    users.sendSMS
  );
  router.get(
    "/sms/testAuth",
    auth(MODE_FULL),
    sendSMSLimit.resolver,
    users.testAuthSMS
  );

  // QR authentication
  router.post("/qr/generate", auth(MODE_FULL), users.generateQR);
  router.post("/qr/auth", auth(MODE_QR), users.authQR);
  router.get("/qr/testAuth", auth(MODE_FULL), users.testAuthQR);

  //get profile
  router.get("/profile/get", auth(MODE_FULL), users.getProfile);

  //update profile
  router.put("/profile/update", auth(MODE_FULL), users.updateProfile);

  //upload image to s3
  router.put("/profile/image", auth(MODE_FULL), upload.single('image_data'), users.uploadImg);

  app.use("/api/users", router);
};
