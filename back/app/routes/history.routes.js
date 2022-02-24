module.exports = (app) => {
    const history = require("../controllers/history.controller.js");
    const auth = require("../middleware/auth");
    const { MODE_FULL } = auth;

    const router = require("express").Router();

    // Create a new History
    router.post("/", auth(MODE_FULL), history.create);
    router.put("/:id", auth(MODE_FULL), history.update);
    router.delete("/:id", auth(MODE_FULL), history.delete);

    // Retrieve all vested History
    router.get("/findAllVested", auth(MODE_FULL), history.findAllVested);

    // Retrieve all withdrawn History
    router.get("/findAllWithdrawn", auth(MODE_FULL),  history.findAllWithdrawn);

    app.use("/api/history", auth(MODE_FULL), router);
  };
