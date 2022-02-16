const db = require("../models");
const crypto = require("crypto");
const User = db.users;
const History = db.history;
const Op = db.Sequelize.Op;
const PasswordResets = db.passwordreset;
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const axios = require("axios");
const md5 = require("md5");
const fs = require("fs");
const communicationService = require('./../services/communication.services')
const passwordService = require('./../services/password.services')

dotenv.config();

var AWS = require("aws-sdk");
const { MODE_QR, MODE_SMS, MODE_FULL, getTokenSecret, MODE_QR_EXPIRES_IN, MODE_SMS_EXPIRES_IN, MODE_FULL_EXPIRES_IN } = require("../middleware/auth");
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
  (async () => {
    try {
      apiRes = await axios.get(url);
    } catch (err) {
      apiRes = err.response.status;
    } finally {
      // console.log("******", apiRes.config.url);
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
          profile_img_url: apiRes.config.url
        };
      }

      try {
        // TODO: add limit of maximum trials
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

        link = "https://" + process.env.HOSTNAME + "/verifyEmail?id=" + rand

        const templateData = JSON.stringify({
          link: link
        });

        // refactored AWS.SES in communicationService
        const response = await communicationService.sendTemplatedEmail(req.body.email, templateData)
        res.send({
          result: response,
          data: resp,
        });
      } catch (err) {
        res.status(500).send({
          message: "Something went wrong.",
        });
        console.error(err);
      }
    }
  })();
};

/**
 * Method that creates a token for password reset.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.requestPasswordReset = async (req, res) => {
  // check if email is present
  if (typeof req.query.email !== 'undefined') {

    const user = await User.findOne({
      where: { email: req.query.email }
    })

    if (!user)
      res.send({ message: 'Cannot find User with given email.' })

    const token = crypto.randomBytes(20).toString("hex")

    const alreadyRequested = await PasswordResets.findOne({ userEmail: user.email, status: 'active' })

    if (alreadyRequested)
      await PasswordResets.update({ status: 'inactive' }, { where: { userEmail: user.email, status: 'active' } })

    // create password reset record
    const resetRequest = await PasswordResets.create({
      userEmail: user.email,
      token: token,
      status: 'active'
    })

    if (resetRequest) {
      link = "https://" + process.env.HOSTNAME + "/create-new-password?token=" + token;

      const templateData = JSON.stringify({
        link: link,
      });

      // refactored AWS.SES in communicationService
      const response = await communicationService.sendTemplatedEmail(req.query.email, templateData, communicationService.emailTemplatesNames.resetPassword)

      if (response) {
        res.send({
          message: 'Successfully requested a new password!',
          status: 'generated'
        })
      } else {
        res.send({ message: 'Some error occurred.' })
      }
    } else {
      res.send({ message: 'While updating token, some error occured.' })
    }
  } else {
    res.status(400).send({
      message: 'E-mail query parameter is requested.'
    })
  }
}

/**
 * Method that resets user's password.
 */
exports.resetPassword = async (req, res) => {
  // Validate request
  if (!req.body.password || !req.body.token || req.body.token === '' || req.body.password === '') {
    res.status(400).send({
      message: "Required properties are not present in the request.",
    });
    return;
  }

  const passwordResetRequest = await PasswordResets.findOne({ token: req.body.token })

  if (passwordResetRequest) {
    const user = await User.findOne({ email: passwordResetRequest?.dataValues.userEmail })

    if (user) {
      const token = jwt.sign(
        { user_name: user?.dataValues.user_name, email: user?.dataValues.email },
        getTokenSecret(MODE_FULL), // after reset password he will be logged in fully but maybe we should init 2fa...
        {
          expiresIn: "168h",
        }
      )

      console.log('creating a hash')
      const data = {
        password: await passwordService.generateHashBcrypt(req.body.password),
        token: token
      }

      // update the user
      const numberOfUpdatedUsers = (await User.update(data, {
        where: { email: passwordResetRequest?.dataValues.userEmail }
      }))[0];

      if (numberOfUpdatedUsers) {

        await PasswordResets.update({ status: 'inactive' }, { where: { userEmail: passwordResetRequest?.dataValues.userEmail, status: 'active' } })

        res.send({ message: 'Successfully changed a password.', status: 'success', token: token, username: user?.dataValues.user_name })
      } else {
        res.send({ message: 'Some error occurred during the update of user.', status: 'failed' })
      }

    } else {
      res.send({ message: 'User does not exist.', email: passwordResetRequest?.dataValues.userEmail })
    }
  } else {
    res.send({ message: 'Token is not valid, please request a new password reset request and try again.' })
  }
}

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
    // TODO: limit maximum trials.
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
      // New users should be logged in fully
      getTokenSecret(MODE_FULL),
      {
        expiresIn: "168h",
      }
    );
    // Create a User password
    const data = {
      password: await passwordService.generateHashBcrypt(req.body.password),
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
      // TODO: error message may reveal security holes
      message: err.message,
    });
  }
};

// Signin and Save a new token
exports.signin = async (req, res) => {
  // Validate request
  if (!req.body.email && !req.body.password || req.body.password === '') {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  try {
    // TODO: security holes:
    // 1. when email is found, the request is slower
    // without limiting the maximum trials a hacker could retrieve the registered emails.
    // 2. with enough trials a hacker could sign in

    const user = await User.findOne({ where: { email: req.body.email } });
    const comparePassword = await passwordService.verifyPasswordHash(user.dataValues.password, req.body.password)
    if (!comparePassword) {
      res.status(401).send({
        message: `Wrong password.`,
      });
      return;
    }

    let token_secret_mode;
    let token_expiration;
    if (user.dataValues.enable_totp) {
      token_secret_mode = MODE_QR;
      token_expiration = MODE_QR_EXPIRES_IN;
    } else if (user.dataValues.enable_sms) {
      token_secret_mode = MODE_SMS;
      token_expiration = MODE_SMS_EXPIRES_IN;
    } else {
      token_secret_mode = MODE_FULL;
      token_expiration = MODE_FULL_EXPIRES_IN;
    }

    const token = jwt.sign(
      { user_name: user.dataValues.user_name, email: user.dataValues.email },
      getTokenSecret(token_secret_mode),
      {
        expiresIn: token_expiration,
      }
    );

    // Update token
    const data = {
      token: token,
    };
    const numberOfUpdatedUsers = (await User.update(data, {
      where: { email: req.body.email },
    }))[0];
    if (numberOfUpdatedUsers === 1) {
      res.send({
        message: "Logged in successfully",
        token: token,
        user_name: user.dataValues.user_name,
        enable_totp: user.dataValues.enable_totp,
        enable_sms: user.dataValues.enable_sms,
      });
    } else {
      throw `Cannot update token with user email=${req.body.email}.`
    }
  } catch (err) {
    res.status(500).send({
      message: "Something went wrong",
    });
    console.error(`Possible login trial to an unregistered account, because of error: ${err}`);
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
        // TODO: error message may reveal security holes
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
  var message = "Here is your SMS 2-factor authentication code for StrongNode : " + OTP;
  var applicationId = process.env.ApplicationId;
  var messageType = "TRANSACTIONAL";
  var registeredKeyword = "strongnode";
  var senderId = "MySenderID";

  // var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

  // AWS.config.credentials = credentials;
  AWS.config.update({ region: aws_region });

  var pinpointOptions = {}
  if (process.env.AWS_LOCALSTACK_URL != '') {
    pinpointOptions.endpoint = process.env.AWS_LOCALSTACK_URL
  }

  var pinpoint = new AWS.Pinpoint(pinpointOptions);

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

  pinpoint.sendMessages(params, function (err, data) {
    // TODO: add automated integrated tests for SMS auth.
    // To test SMSes locally, use these:
    // ```
    // console.log(OTP);
    // err = false
    // ```
    // this will bypass pinpoint error and logs OTP to the server logs.
    if (err) {
      res.end(JSON.stringify({ Error: err }));
    } else {
      const user_sms = {
        smscode: OTP,
      };
      User.update(user_sms, {
        where: { email: req.user.email },
      })
        .then((num) => {
          if (num === 0) {
            console.error(`user with email ${req.user.email} was not found during sending sms`)
          }
          res.send({
            message: "Sent SMS Code successfully.",
          });
        })
        .catch((_err) => {
          res.status(500).send({
            message: "Something went wrong.",
          });
        });
    }
  });
};

// When user sets SMS 2FA method, we have to test it first
exports.testAuthSMS = (req, res) => {
  const email = req.user.email;
  const para_smscode = req.query.smscode;

  User.findAll({ where: { email } })
    .then((data) => {
      if (data.length === 1 && data[0].smscode === para_smscode) {
        res.send({
          success: true
        });
      } else {
        res.send({
          success: false
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong.",
      });
    });
};

// When user signs in with SMS 2FA method
exports.authSMS = (req, res) => {
  const { email } = req.user;
  const para_smscode = req.query.smscode;

  User.findAll({ where: { email } })
    .then((users) => {
      if (users.length === 1 && users[0].smscode === para_smscode) {
        // generate token for the next stage
        const next_token = jwt.sign(
          { user_name: users[0].user_name, email: users[0].email },
          getTokenSecret(MODE_FULL),
          {
            expiresIn: MODE_FULL_EXPIRES_IN,
          }
        );

        // update token and send to the user
        User.update({ token: next_token }, { where: { email } })
        res.send({
          success: true,
          token: next_token,
        });
      } else {
        res.send({
          success: false
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong.",
      });
    });
};

exports.generateQR = async (req, res) => {
  try {
    const email = req.user.email;
    const temp_secret = speakeasy.generateSecret({ name: "StrongNode" });
    const totp_qrcode = await QRCode.toDataURL(temp_secret.otpauth_url);

    const db_qr = {
      qrcode: totp_qrcode,
      qr_secret: temp_secret.base32,
    };
    await User.update(db_qr, { where: { email } });

    return res.send({
      url: totp_qrcode,
    });
  } catch(err) {
    return res.status(500).send({});
  }
};

// Verify TOTP
exports.authQR = async (req, res) => {
  const { email } = req.user;
  const { token } = req.body;

  try {
    let users = await User.findAll({ where: { email: email } });
    const verified = speakeasy.totp.verify({
      secret: users[0].qr_secret,
      encoding: "base32",
      token,
    });

    if (verified) {
      // determine the next stage of user auth flow
      let token_secret_mode;
      let token_expiration;
      if (users[0].enable_sms) {
        token_secret_mode = MODE_SMS;
        token_expiration = MODE_SMS_EXPIRES_IN;
      } else {
        token_secret_mode = MODE_FULL;
        token_expiration = MODE_FULL_EXPIRES_IN;
      }
      // generate token for the next stage
      const next_token = jwt.sign(
        { user_name: users[0].user_name, email: users[0].email },
        getTokenSecret(token_secret_mode),
        {
          expiresIn: token_expiration,
        }
      );

      // update user
      const data = {
        token: next_token,
        // TODO: review these fields, it seems unnecessary
        qr_secret: users[0].qr_secret,
        enable_totp: true,
      };
      const numberOfUpdatedUsers = (await User.update(data, { where: { email }, }))[0];
      if (numberOfUpdatedUsers == 1) {
        return res.json({
          token: next_token,
          verified: true,
          enable_sms: users[0].dataValues.enable_sms,
        });
      }
    }
    return res.send({
      verified: false,
    });
  } catch(err) {
    res.status(500).send({
      message: "Something went wrong",
    });
    console.error(err);
  }
};

exports.testAuthQR = async (req, res) => {
  const { email } = req.user;
  const { token } = req.body;

  try {
    let users = await User.findAll({ where: { email: email } });
    const verified = speakeasy.totp.verify({
      secret: users[0].qr_secret,
      encoding: "base32",
      token,
    });
    res.send({ verified });
  } catch(err) {
    res.status(500).send({
      message: "Something went wrong",
    });
    console.error(err);
  }
};

//Verify Email
exports.verifyEmail = async (req, res) => {
  // Validate request
  if (!req.body.password_token) {
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
      // TODO: error message may reveal security holes
      message: err.message,
    });
  }
};

//Get profile
exports.getProfile = (req, res) => {
  User.findAll({ where: { email: req.user.email } })
    .then((data) => {
      // TODO: possible data leak, it would be good to show only the required fields
      // Also /profile/get should return only 1 user not a list of users
      // Also GET /profile and PATCH or PUT /profile would be enough
      // There is no need for additional ../get and ../update routes
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        // TODO: error message may reveal security holes
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

//Update profile
exports.updateProfile = async (req, res) => {
  const { email } = req.user;
  const { first_name, last_name, user_name, twitter_id, telegram_id, wallet_address, enable_totp, enable_sms } = req.body;

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
    enable_sms: enable_sms
  };

  User.update(data, {
    where: { email: email },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User profile was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User profile with username=${req.user.user_name}. Maybe User profile info was not found or req.body is empty!`,
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

//Upload profile Image
exports.uploadImg = async (req, res) => {
  const { email } = req.user;
  const { user_name, image_data } = req.body;

  if (!email) {
    res.status(400).send({
      message: "Email is required!",
    });
    return;
  }

  //upload image data to S3
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    Bucket: "strong-profile-img",
    ACL: "public-read",
  });

  if (image_data !== undefined) {

    const base64Data = new Buffer.from(
      image_data.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const image_type = image_data.split(";")[0].split("/")[1];
    let s3_image_url = "";
    let key = "";

    /*
      s3.createBucket(function(){
        var s3_params={
          Bucket: 'strong-profile-img',
          Key: `${user_name}.${image_type}`,
          Body: base64Data,
          ContentEncoding: 'base64',
          ContentType: `image/${image_type}`
        };
        const { Location, Key } =s3.upload(s3_params, function(err,data)
        {
          if(err){
            console.log(err);
          }
          else{
          console.log('success');
          console.log(data);
          }
        }).promise();
        s3_image_url = Location;
        key = Key;
      })
    */

    const s3_params = {
      Bucket: "strong-profile-img",
      Key: `${user_name}.${image_type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${image_type}`,
    };

    try {
      const { Location, Key } = await s3.upload(s3_params).promise();
      s3_image_url = Location;
      key = Key;
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message:
          "Error uploading User profile image with username=" + user_name,
      });
    }

    const data = {
      profile_img_type: image_type,
      profile_img_url: s3_image_url,
      profile_img_key: key,
    };

    User.update(data, {
      where: { email: email },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "User profile image was uploaded successfully.",
          });
        } else {
          res.send({
            message: "Cannot upload User profile image with username=" + user_name,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err,
        });
      });
  };

};

exports.addData = async (req, res) => {
  // Create a User profile
  const data = {
    username: req.body.user_name,
    token_amount: req.body.value,
    action_type: req.body.type,
    date: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const history = new History(data);
  history.save().then(() => {
    console.log("success");
    res.send("success");
  })
}
