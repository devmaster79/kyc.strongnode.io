const { MODE_FULL } = require("../services/auth/TokenService.js");
const users = require("../controllers/user.controller.js");
const auth = require("../middleware/auth");
const multer = require('multer')

module.exports = (app) => {
  const upload = multer({ dest: '../uploads/' })
  const router = require("express").Router();

  router.put("/createInvestor", auth(MODE_FULL), users.createInvestor);

  //profile
  router.get("/profile", auth(MODE_FULL), users.getProfile);
  router.post("/profile", auth(MODE_FULL), users.createProfile);
  router.put("/profile", auth(MODE_FULL), users.updateProfile);
  router.get("/profile/getInvestorProfile", auth(MODE_FULL), users.getInvestorDetails);

  router.post("/support/create-request", auth(MODE_FULL), users.createSupportRequest);

  //upload image to s3
  router.put("/profile/image", auth(MODE_FULL), upload.single('image_data'), users.uploadImg);

  app.use("/api/users", router);
};
