module.exports = (app) => {
    const news = require("../controllers/news.controller.js");
    const auth = require("../middleware/auth");
  
    const router = require("express").Router();
  
    // Create a News
    router.post("/", auth, news.create);
  
    // Retrieve all News
    router.get("/", auth, news.findAll);
  
    // Update a News with id
    router.put("/:id", auth, news.update);
  
    // Delete a News with id
    router.delete("/:id", auth, news.delete);
  
    // Delete all News
    router.delete("/", auth, news.deleteAll);
  
    app.use("/api/news", router);
  };
  