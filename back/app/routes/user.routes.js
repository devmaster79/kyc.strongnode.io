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
  router.put("/createInvestor", auth(MODE_FULL), users.createInvestor);

  // TODO: review this
  // why was it accessible for guests?
  // also unsued
  // router.put("/addData", users.addData);

  // signin with user email and password
  router.put("/signin", users.signin);

  // Request a password reset
  router.get("/passwordReset", users.requestPasswordReset);

  // Submit a password reset
  router.post("/passwordResetSubmit", users.resetPassword);

  // TODO: review these, users were admins...
  // SECURITY HOLE
  // also unused
  //
  // Retrieve a single User with id
  // router.get("/:id", auth(MODE_FULL), users.findOne);
  //
  // Update a User with id
  // router.put("/:id", auth(MODE_FULL), users.update);
  //
  // Delete a User with id
  // router.delete("/:id", auth(MODE_FULL), users.delete);
  //
  // Delete all Users
  // router.delete("/", auth(MODE_FULL), users.deleteAll);

  // SMS authentication
  router.post("/sms/send", auth(MODE_SMS, MODE_FULL), users.sendSMS);
  router.get("/sms/auth", auth(MODE_SMS), users.authSMS);
  router.get("/sms/testAuth", auth(MODE_FULL), users.authSMS);

  //Generate QR code
  router.put("/totp/qrcode", auth(MODE_QR), users.qrcode);

  //Verify TOTP
  router.post("/totp/verify", auth(MODE_QR), users.verifyTOTP);

  //get profile
  router.get("/profile/get", auth(MODE_FULL), users.getProfile);

  //update profile
  router.put("/profile/update", auth(MODE_FULL), users.updateProfile);

  //upload image to s3
  router.put("/profile/image", auth(MODE_FULL), upload.single('image_data'), users.uploadImg);

  app.use("/api/users", router);
};
