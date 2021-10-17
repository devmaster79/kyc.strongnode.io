const db = require("../models");
const crypto = require("crypto");
const User = db.users;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const axios = require("axios");
const md5 = require("md5");
const fs = require("fs");
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

  //check if gravatar exists
  // var url = gravatar.url(req.body.email, {d: '404'});
  var email_md5 = md5(req.body.email.trim().toLowerCase());
  var url = "http://www.gravatar.com/avatar/" + email_md5 + "?d=404";

  let apiRes = null;
  let data = null;
  ( async() => {
    try {
      apiRes = await axios.get(url);
    } catch (err) {
      apiRes = err.response.status;
    } finally {
      console.log("******", apiRes);
      if (apiRes === 404) {
        data = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          user_name: req.body.user_name,
          email_verified: false,
          password_token: rand,
        };
      } else {
        data = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          user_name: req.body.user_name,
          email_verified: false,
          password_token: rand,
          profile_img_url: apiRes
        };
      }

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
    }
  })();
};

// Create and Save a new User password
exports.createPassword = async (req, res) => {
  // Validate request
  if (!req.body.password) {
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
  var aws_region = "us-west-2";
  var originationNumber = "+18555460621";
  var destinationNumber = req.body.number;
  var message = "Here is SMS code for StrongNode : " + OTP;
  var applicationId = process.env.ApplicationId;
  var messageType = "TRANSACTIONAL";
  var registeredKeyword = "strongnode";
  var senderId = "MySenderID";

  // var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

  // AWS.config.credentials = credentials;
  AWS.config.update({region: aws_region});

  var pinpoint = new AWS.Pinpoint();

  var params = {
    ApplicationId: applicationId,
    MessageRequest: {
      Addresses: {
        [destinationNumber]: {
          ChannelType: 'SMS'
        }
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: message,
          Keyword: registeredKeyword,
          MessageType: messageType,
          OriginationNumber: originationNumber,
          SenderId: senderId,
        }
      }
    }
  };

  pinpoint.sendMessages(params, function(err, data) {
    if(err) {
      res.end(JSON.stringify({ Error: err }));
    } else {
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
    }
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

  var temp_secret = speakeasy.generateSecret({ name: "StrongNode" });
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

//Verify Email
exports.verifyEmail = async (req, res) => {
  // Validate request
  if (!req.body.password_token && req.body.password_token === rand) {
    res.status(400).send({
      message: "Content can not be empty or Bad Request",
    });
    return;
  }

  const data = {
    email_verified: true
  }

  try {
    let user = await User.findOne({
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

    const ret = await User.update(data, {
      where: { password_token: req.body.password_token },
    });

    if (ret == 1) {
      user = await User.findOne({
        where: { password_token: req.body.password_token },
      });
      res.send({
        message: "Email verified successfully.",
        user: {
          "email": user.email,
          "user_name": user.user_name,
          "email_verified": user.email_verified,
          "password_token": user.password_token,
        },
      });
    } else {
      res.send({
        message: "Email was not verified.",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//Get profile
exports.getProfile = (req, res) => {
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

//Update profile
exports.updateProfile = async (req, res) => {
  const { email } = req.body;
  const { first_name, last_name, user_name, twitter_id, telegram_id, wallet_address, enable_totp} = req.body;

  if (!email) {
    res.status(400).send({
      message: "Email is required!",
    });
    return;
  }

  const data = {
    first_name: first_name,
    last_name: last_name,
    user_name: user_name,
    telegram_id: telegram_id,
    twitter_id: twitter_id,
    wallet_address: wallet_address,
    enable_totp: enable_totp,
  };

  User.update(data, {
    where: { email: email },
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
