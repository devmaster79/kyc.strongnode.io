module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../middleware/auth");

  const router = require("express").Router();

  // Create a new User
  router.post("/", users.create);
  router.put("/sendEmail", users.sendEmail);
  router.put("/createPassword", users.createPassword);
  router.put("/createProfile", auth, users.createProfile);
  router.put("/createInvestor", auth, users.createInvestor);

  // signin with user email and password
  router.put("/signin", users.signin);

  // Retrieve all Users
  router.get("/", auth, users.findAll);

  // Retrieve a single User with id
  router.get("/:id", auth, users.findOne);

  // Update a User with id
  router.put("/:id", auth, users.update);

  // Delete a User with id
  router.delete("/:id", auth, users.delete);

  // Delete all Users
  router.delete("/", auth, users.deleteAll);

  //Send SMS and save on user db
  router.post("/sms/send", users.sendSMS);

  //Get User code by email
  router.get("/sms/check", users.getUser);

  //Generate QR code
  router.put("/totp/qrcode", users.qrcode);

  //Verify TOTP
  router.post("/totp/verify", users.verifyTOTP);

  app.use("/api/users", router);
};
