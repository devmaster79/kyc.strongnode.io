module.exports = (app) => {
    const history = require("../controllers/history.controller.js");
    const auth = require("../middleware/auth");
  
    const router = require("express").Router();
  
    // Create a new History
    router.post("/", auth, history.create);
    router.post("/update", auth, history.update);
    router.post("/delete", auth, history.delete);
  
    // Retrieve all vested History
    router.get("/findAllVested", auth, history.findAllVested);

    // Retrieve all withdrawn History
    router.get("/findAllWithdrawn", auth, history.findAllWithdrawn);
  
    app.use("/api/history", router);
  };
  