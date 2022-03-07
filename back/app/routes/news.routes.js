const { MODE_FULL } = require("../services/auth/TokenService.js");
const news = require("../controllers/news.controller.js");
const auth = require("../middleware/auth");

module.exports = (app) => {
  const router = require("express").Router();

  // Create a News
  router.post("/", auth(MODE_FULL), news.create);

  // Retrieve all News
  router.get("/", auth(MODE_FULL), news.findAll);

  // Update a News with id
  router.put("/:id", auth(MODE_FULL), news.update);

  // Delete a News with id
  router.delete("/:id", auth(MODE_FULL), news.delete);

  // Delete all News
  router.delete("/", auth(MODE_FULL), news.deleteAll);

  app.use("/api/news", router);
};