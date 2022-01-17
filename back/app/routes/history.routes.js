module.exports = (app) => {
    const history = require("../controllers/history.controller.js");
    const auth = require("../middleware/auth");

    const router = require("express").Router();

    // Create a new History
    router.post("/", auth, history.create);
    router.post("/update", history.update);
    router.post("/delete", history.delete);

    // Retrieve all vested History
    router.get("/findAllVested", history.findAllVested);

    // Retrieve all withdrawn History
    router.get("/findAllWithdrawn",  history.findAllWithdrawn);

    app.use("/api/history", router);
  };
