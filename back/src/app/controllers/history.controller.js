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
    date: req.body.date,
  };

  try {
    const response = await History.create(data);
    res.send(response);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while adding data on history table.",
    });
  }
};

// Retrieve all vested history with user_name on history table.
exports.findAllVested = async (req, res) => {
  // Validate request
  if (!req.query.user_name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const user_name = req.query.user_name;
  const condition = user_name
    ? { [Op.and]: [{ user_name: user_name }, { action_type: "vested" }] }
    : null;

  const page = req.query.page * req.query.perPage || 0;

  try {
    const data = await History.findAndCountAll({ limit: parseInt(req.query.perPage), offset: page, where: condition });
    res.send({
      items: data.rows,
      total: data.count
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving vested history with user_name.",
    });
  }
};

exports.findVestedDetails = async (req, res) => {
  // Validate request
  if (!req.query.user_name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const user_name = req.query.user_name;
  const condition = user_name
    ? { [Op.and]: [{ user_name: user_name }, { action_type: "vested" }] }
    : null;

  try {
    const sum = await History.sum('token_amount', { where: condition });
    res.send({
      sum: sum
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving vested history with user_name.",
    });
  }
};

// Retrieve all withdrawn history with user_name on history table.
exports.findAllWithdrawn = async (req, res) => {
  // Validate request
  if (!req.query.user_name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const user_name = req.query.user_name;
  const condition = user_name
    ? { [Op.and]: [{ user_name: user_name }, { action_type: "withdrawn" }] }
    : null;

  const page = req.query.page * req.query.perPage || 0;

  try {
    const data = await History.findAndCountAll({ limit: parseInt(req.query.perPage), offset: page, where: condition });
    res.send({
      items: data.rows,
      total: data.count
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving withdrawn history with user_name.",
    });
  }
};

exports.findWithdrawnDetails = async (req, res) => {
  // Validate request
  if (!req.query.user_name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const user_name = req.query.user_name;
  const condition = user_name
    ? { [Op.and]: [{ user_name: user_name }, { action_type: "withdrawn" }] }
    : null;


  try {
    const sum = await History.sum('token_amount', { where: condition });
    res.send({
      sum: sum
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving withdrawn history with user_name.",
    });
  }
};

exports.delete = async (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const id = req.params.id;
  try {
    const ret = await History.destroy({
      where: { id: id },
    });
    res.send({ message: "History was deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving remove history with user_name.",
    });
  }
};

exports.update = async (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const id = req.params.id;

  try {
    const ret = await History.update(
      { token_amount: req.body.token_amount, date: req.body.date },
      {
        where: { id: id },
      }
    );
    res.send(ret);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving update history with user_name.",
    });
  }
};
