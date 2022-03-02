const auth = require("../middleware/auth");
const users = require("../controllers/user.controller");
module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middleware/auth");
  const { MODE_FULL, MODE_QR, MODE_SMS } = auth;
  const multer = require('multer')
  const upload = multer({ dest: 'uploads/' })
  const router = require("express").Router();

  // Create a new User
  router.post("/", users.create);
  router.put("/verifyEmail", users.verifyEmail);
  router.put("/createPassword", users.createPassword);
  router.put("/createProfile", auth(MODE_FULL), users.createProfile);
  router.put("/createInvestor", users.createInvestor);

  // signin with user email and password
  router.put("/signin", users.signin);

  // Request a password reset
  router.get("/passwordReset", users.requestPasswordReset);

  // Submit a password reset
  router.post("/passwordResetSubmit", users.resetPassword);

  // SMS authentication
  router.post("/sms/send", auth(MODE_SMS, MODE_FULL), users.sendSMS);
  router.get("/sms/auth", auth(MODE_SMS), users.authSMS);
  router.get("/sms/testAuth", auth(MODE_FULL), users.testAuthSMS);

  // QR authentication
  router.put("/qr/generate", auth(MODE_FULL), users.generateQR);
  router.post("/qr/auth", auth(MODE_QR), users.authQR);
  router.post("/qr/testAuth", auth(MODE_FULL), users.testAuthQR);

  //get profile
  router.get("/profile/get", auth(MODE_FULL), users.getProfile);
  router.get("/profile/getInvestorProfile", auth(MODE_FULL), users.getInvestorDetails);

  //update profile
  router.put("/profile/update", auth(MODE_FULL), users.updateProfile);

  //upload image to s3
  router.put("/profile/image", auth(MODE_FULL), upload.single('image_data'), users.uploadImg);

  app.use("/api/users", router);
};
