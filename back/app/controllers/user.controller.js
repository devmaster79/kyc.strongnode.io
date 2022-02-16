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
const userService = require('./../services/user.services')

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

        link = "https://" + process.env.HOSTNAME_KYC + "/verifyEmail?id=" + rand

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
          message: err.message || "Some error occurred while creating the User.",
        });
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
      link = "https://" + process.env.HOSTNAME_KYC + "/create-new-password?token=" + token;

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
          process.env.TOKEN_SECRET,
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
      const userUpdate = await User.update(data, {
        where: { email: passwordResetRequest?.dataValues.userEmail }
      })

      if (userUpdate) {

        await PasswordResets.update({ status: 'inactive' }, { where: { userEmail: passwordResetRequest?.dataValues.userEmail, status: 'active' } })

        res.send({ message: 'Successfully changed a password.', status: 'success', token: token, username: user?.dataValues.user_name })
      } else {
        res.send({message: 'Some error occurred during the update of user.', status: 'failed'})
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
    const user = await User.findOne({ where: { email: req.body.email } });

    const comparePassword = await passwordService.verifyPasswordHash(user.dataValues.password, req.body.password)

    if (!comparePassword) {
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

/**
 * Method that is being used for requesting SMS OTP.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.sendSMS = async (req, res) => {
  // check the required parameters
  if (typeof req.body.email === 'undefined')
    res.send({message: 'Required parameters are not present.'})

  var OTP = generateRandomNumber(1000, 9999);

  var destinationNumber = req.body.number;
  var message = "Here is your SMS 2-factor authentication code for StrongNode : " + OTP;

  const sentSms = communicationService.sendSms(destinationNumber, message)

  if (sentSms.status) {
    User.update({ smscode: OTP }, {
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
              message: `Cannot send SMS code with email=${req.body.email}. Users does not exist.`,
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
    console.log(sentSms.err)
    res.send({ message: 'An error occurred with AWS pinpoint. Please, check servers console to see the error.' })
  }
};

//Get Userinfo from DB by email
exports.getUser = (req, res) => {
  const para_email = req.query.email;

  userService.getUsersPublicData({ email: para_email }).then((data) => {
    res.send(data)
  })
  .catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users."
    })
  })
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

//Upload profile Image
exports.uploadImg = async (req, res) => {
  const { email, user_name, image_data } = req.body;

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
    createdAt : Date.now(),
    updatedAt : Date.now(),
  };

  const history = new History(data);
  history.save().then(()=>{
    console.log("success");
    res.send("success");
  })
}
