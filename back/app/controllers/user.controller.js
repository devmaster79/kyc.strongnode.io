const db = require("../models");
const crypto = require("crypto");
const User = db.users;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const dotenv = require("dotenv");
dotenv.config();

var AWS = require("aws-sdk");
var rand, host, link;

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.first_name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  rand = crypto.randomBytes(20).toString("hex");

  // Create a User
  const data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    user_name: req.body.user_name,
    email_verified: false,
    password_token: rand,
  };
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ user_name: req.body.user_name }, { email: req.body.email }],
      },
    });
    if (user) {
      res.status(409).send({
        message: "Same email or user_name already exists!",
      });
      return;
    }

    // Save User in the database

    const resp = await User.create(data);
    if (!resp)
      res.send({
        result: resp,
      });
    link = "https://stage.strongnode.io/verifyEmail?id=" + rand;
    const ses = new AWS.SES({
      region: "us-west-2",
    });
    const templateData = JSON.stringify({
      link: link,
    });

    const params = {
      Destinations: [
        {
          Destination: {
            ToAddresses: [req.body.email],
          },
          ReplacementTemplateData: templateData,
        },
        /* more items */
      ],
      Source: "Notifications <no-reply@strongnode.io>",
      Template: "EmailTemplate",
      DefaultTemplateData: '{ "link":"unknown"}',
    };

    const response = await ses.sendBulkTemplatedEmail(params).promise();
    res.send({
      result: response,
      data: resp,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
};

// Create and Save a new User password
exports.createPassword = async (req, res) => {
  // Validate request
  if (!req.body.password_token) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  try {
    const user = await User.findOne({
      where: { password_token: req.body.password_token },
    });
    if (!user) {
      res.send({
        message: `Cannot find a User with password_token=${req.body.password_token}.`,
      });
    }

    if (user.dataValues.email_verified) {
      res.send({
        message: `Already verified the User with password_token=${req.body.password_token}.`,
      });
    }

    const token = jwt.sign(
      { user_name: user?.dataValues.user_name, email: user?.dataValues.email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "168h",
      }
    );

    // Create a User password
    const data = {
      password: req.body.password,
      email_verified: true,
      token: token,
    };

    const ret = await User.update(data, {
      where: { password_token: req.body.password_token },
    });

    if (ret == 1) {
      res.send({
        message: "User password was created successfully.",
        token: token,
      });
    } else {
      res.send({
        message: `Cannot create User password with password_token=${req.body.password_token}. Maybe User password was not found or req.body is empty!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Signin and Save a new token
exports.signin = async (req, res) => {
  // Validate request
  if (!req.body.email && !req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (req.body.password !== user.dataValues.password) {
      res.status(401).send({
        message: `Wrong password.`,
      });
      return;
    }

    const token = jwt.sign(
      { user_name: user.dataValues.user_name, email: user.dataValues.email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "168h",
      }
    );
    // Create a User password
    const data = {
      token: token,
    };

    const ret = await User.update(data, {
      where: { email: req.body.email },
    });

    if (ret == 1) {
      res.send({
        message: "Logged in successfully",
        token: token,
        user_name: user.dataValues.user_name,
      });
    } else {
      res.send({
        message: `Cannot update token with user email=${req.body.email}.`,
      });
      return;
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Create and Save a User profile
exports.createProfile = (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a User profile
  const data = {
    telegram_id: req.body.telegram_id,
    twitter_id: req.body.twitter_id,
    wallet_address: req.body.wallet_address,
  };

  User.update(data, {
    where: { user_name: req.user.user_name },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User profile was created successfully.",
        });
      } else {
        res.send({
          message: `Cannot create User profile with username=${req.user.user_name}. Maybe User profile info was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error creating User profile with username=" + req.user.user_name,
      });
    });
};

// Create and Save a User profile
exports.createInvestor = (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
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
    investor_fund_website: req.body.investor_fund_website,
  };

  User.update(data, {
    where: { user_name: req.user.user_name },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Investor was created successfully.",
        });
      } else {
        res.send({
          message: `Cannot create Investor with username=${req.user.user_name}. Maybe Investor info was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error creating Investor with username=" + req.user.user_name,
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const first_name = req.query.first_name;
  const condition = first_name
    ? { first_name: { [Op.like]: `%${first_name}%` } }
    : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//Send SMS and save password
exports.sendSMS = (req, res) => {
  var OTP = generateRandomNumber(1000, 9999);

  var params = {
    Message: "Here is SMS code for StrongNode : " + OTP,
    PhoneNumber: "+" + req.body.number,
  };

  var publishTextPromise = new AWS.SNS({ apiVersion: "2021-09-05" })
    .publish(params)
    .promise();

  publishTextPromise
    .then(function (data) {
      const user_sms = {
        smscode: OTP,
      };
      User.update(user_sms, {
        where: { email: req.body.email },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              result: 1,
              message: "Sent SMS Code successfully.",
            });
          } else {
            res.send({
              result: 2,
              message: `Cannot send SMS code with email=${req.body.email}. Maybe User email was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            result: 3,
            message: err,
          });
        });
    })
    .catch(function (err) {
      res.end(JSON.stringify({ Error: err }));
    });
};

//Get Userinfo from DB by email
exports.getUser = (req, res) => {
  const para_email = req.query.email;

  User.findAll({ where: { email: para_email } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

//Generate QR code for TOTP
exports.qrcode = async (req, res) => {
  const email = req.body.email;

  var temp_secret = speakeasy.generateSecret({ name: process.env.APP_NAME });
  const totp_qrcode = await QRCode.toDataURL(temp_secret.otpauth_url);

  const db_qr = {
    qrcode: totp_qrcode,
    qr_secret: temp_secret.base32,
  };

  User.update(db_qr, {
    where: { email: email },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          secret: temp_secret.base32,
          url: totp_qrcode,
        });
      } else {
        res.send({
          result: num,
          message: `Cannot generate QR code with email=${email}. Maybe User email was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        result: 3,
        message: err,
      });
    });
};

// Verify TOTP
exports.verifyTOTP = async (req, res) => {
  const { email, token } = req.body;

  User.findAll({ where: { email: email } })
    .then((data) => {
      const secret = data[0].qr_secret;
      const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
      });

      if (verified) {
        const db_secret = {
          qr_secret: secret,
          enable_totp: true,
        };
        User.update(db_secret, {
          where: { email: email },
        })
          .then((num) => {
            if (num == 1) {
              res.json({ verified: true });
            } else {
              res.send({
                result: num,
                message: `Cannot update QR sercret code with email=${email}. Maybe User email was not found!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              result: 3,
              message: err,
            });
          });
      } else {
        res.send({
          verified: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

//Send Email
exports.sendEmail = async (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // host = req.get("host");
  // link = "https://" + req.get("host") + "/api/users/verifyEmail?id=" + rand;
  link = "https://stage.strongnode.io/verifyEmail?id=" + rand;

  const ses = new AWS.SES({
    region: "us-west-2",
  });

  const templateData = JSON.stringify({
    link: link,
  });

  const params = {
    Destinations: [
      {
        Destination: {
          ToAddresses: [req.body.email],
        },
        ReplacementTemplateData: templateData,
      },
      /* more items */
    ],
    Source: "Notifications <no-reply@strongnode.io>",
    Template: "EmailTemplate",
    DefaultTemplateData: '{ "link":"unknown"}',
  };

  const resp = await ses.sendBulkTemplatedEmail(params).promise();
  res.send({
    result: resp,
  });
};

//Verify Email
exports.verifyEmail = (req, res) => {
  // Validate request
  if (req.protocol + "://" + req.get("host") == "https://" + host) {
    if (req.query.id == rand) {
      res.send({
        result: "200",
      });
    } else {
      res.status(500).send({
        message: "Bad Request",
      });
    }
  } else {
    res.status(500).send({
      message: "Request is from unknown source",
    });
  }
};
