const db = require("../models");
const History = db.history;
const Op = db.Sequelize.Op;

// Add new data on history table.
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.user_name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const data = {
    user_name: req.body.user_name,
    action_type: req.body.action_type,
    token_amount: req.body.token_amount,
    user_name: req.body.user_name,
    date: req.body.date,
  };

  try {
    const response = await History.create(data)
    res.send(response)
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while adding data on history table.",
    })
  }
};

// Retrieve all vested history with user_name on history table.
exports.findAllVested = async (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const user_name = req.query.user_name;
  const condition = user_name
    ? { user_name: { [Op.and]: [{ user_name: req.body.user_name }, { action_type: 'vested' }] } }
    : null;

  try {
    const data = await History.findAll({ where: condition })
    res.send(data)
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving vested history with user_name.",
    });
  }
};

// Retrieve all withdrawn history with user_name on history table.
exports.findAllWithdrawn = async (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const user_name = req.query.user_name;
  const condition = user_name
    ? { user_name: { [Op.and]: [{ user_name: req.body.user_name }, { action_type: 'withdrawn' }] } }
    : null;

  try {
    const data = await History.findAll({ where: condition })
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving withdrawn history with user_name.",
    });
  }
};

