const db = require("../models");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.first_name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const password_token = crypto.randomBytes(20).toString('hex');

  // Create a User
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    user_name: req.body.user_name,
    email_verified: false,
    password_token: password_token,
  };

  // Save User in the database
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Create and Save a new User password
exports.createPassword = (req, res) => {
  // Validate request
  if (!req.body.password_token) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a User password
  const data = {
    password: req.body.password,
    email_verified: true,
  };
  
  User.update(data, {
    where: { password_token: req.body.password_token }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User password was created successfully."
        });
      } else {
        res.send({
          message: `Cannot create User password with password_token=${req.body.password_token}. Maybe User password was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error creating User password with password_token=" + req.body.password_token
      });
    });
};

// Create and Save a User profile
exports.createProfile = (req, res) => {
  // Validate request
  if (!req.body.password_token) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a User profile
  const data = {
    telegram_id: req.body.telegram_id,
    twitter_id: req.body.twitter_id,
    wallet_address: req.body.wallet_address
  };
  
  User.update(data, {
    where: { password_token: req.body.password_token }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User profile was created successfully."
        });
      } else {
        res.send({
          message: `Cannot create User profile with password_token=${req.body.password_token}. Maybe User profile info was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error creating User profile with password_token=" + req.body.password_token
      });
    });
};

// Create and Save a User profile
exports.createInvestor = (req, res) => {
  // Validate request
  if (!req.body.password_token) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Investor
  const data = {
    investor_name: req.body.investor_name,
    investor_telegram_id: req.body.investor_telegram_id,
    investor_country: req.body.investor_country,
    investor_commitment_amount: req.body.investor_commitment_amount,
    investor_wallet_address: req.body.investor_wallet_address,
    investor_email: req.body.investor_email,
    investor_fund_name: req.body.investor_fund_name,
    investor_fund_website: req.body.investor_fund_website
  };
  
  User.update(data, {
    where: { password_token: req.body.password_token }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Investor was created successfully."
        });
      } else {
        res.send({
          message: `Cannot create Investor with password_token=${req.body.password_token}. Maybe Investor info was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error creating Investor with password_token=" + req.body.password_token
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const first_name = req.query.first_name;
  var condition = first_name ? { first_name: { [Op.like]: `%${first_name}%` } } : null;

  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

