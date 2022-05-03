import { User, SupportRequest, InvestorDetail, UserWallets } from '../models'
import AWS from 'aws-sdk'
import { EmailService } from 'app/services/communication/EmailService'
import { AWS_CONFIG, EMAIL_CONFIG } from 'app/config/config'
import { SupportRequestTemplate } from 'app/services/communication/templates/SupportRequestTemplate'
import { Request, Response } from 'express'
import { Logger } from 'app/services/Logger'

const UserControllerLogger = new Logger('UserController')
type UserRequest = Request & { user: { email: string; user_name: string }}
type GetUserWalletResponse = { email: string; wallets: Array<string> }

/**
 * Method that is used for adding or updating user wallets.
 * @param req
 * @param res
 */
export const addOrUpdateWallet = async (req: UserRequest, res: Response) => {
  const { email } = req.user

  if (!req.body.wallet)
    return res.status(400).send({ message: 'Required parameter wallet is not present.' })

  const userDetails = await User.findOne({ where: { email: email } })

  if (userDetails) {
    const userWallets = await UserWallets.findAll({ where: { user_id: userDetails.id, wallet: req.body.wallet } })

    if (userWallets.length > 0) {
      await UserWallets.update({ wallet: req.body.wallet }, { where: { user_id: userDetails.id, wallet: req.body.wallet } })
      return res.send({message: 'Wallets successfully updated.'})
    } else {
      const createdWallet = await UserWallets.create({ wallet: req.body.wallet, user_id: userDetails.id })
      return res.send({message: 'Wallet successfully created.'})
    }

  } else {
    res.status(500).send({ message: 'Error getting the wallet data for user.' })
  }

  // can I get id directly from the user object?
  return res.send(req.user)
}

/**
 * Method that gets all user wallets.
 * @param req
 * @param res
 */
export const getUserWallets = async (req: UserRequest, res: Response) => {
  const { email } = req.user

  const userDetails = await User.findOne({ where: { email: email } })

  if (userDetails) {
    const response: GetUserWalletResponse = { email: email, wallets: [] }
    const userWallets = await UserWallets.findAll({ where: { user_id: userDetails.id } })

    userWallets.forEach((wallet: any) => {
      response.wallets.push(wallet.wallet)
    })

    return res.send(response)
  } else {
    return res.status(500).send({ message: 'Error getting the wallet data for user.' })
  }
}

/** Create and Save a User profile */
export const createProfile = (req: UserRequest, res: Response) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: 'Content can not be empty!'
    })
    return
  }

  // Create a User profile
  const data = {
    telegram_id: req.body.telegram_id,
    twitter_id: req.body.twitter_id,
    wallet_address: req.body.wallet_address
  }

  User.update(data, {
    where: { user_name: req.user.user_name }
  })
    .then((num) => {
      if (num) {
        res.send({
          message: 'User profile was created successfully.'
        })
      } else {
        res.send({
          message: `Cannot create User profile with username=${req.user.user_name}. Maybe User profile info was not found or req.body is empty!`
        })
      }
    })
    .catch((err) => {
      UserControllerLogger.error(err)
      res.status(500).send({
        message:
          'Error creating User profile with username=' + req.user.user_name
      })
    })
}

/**
 * Method create investor that is being used for creating investor detail row in investorDetails table.
 * TODO we should turn this piece of code into it's own "business logic" service
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const createInvestor = async (req: Request, res: Response) => {
  // validate request
  if (
    !req.body.investor_name ||
    !req.body.investor_telegram_id ||
    !req.body.investor_country ||
    !req.body.investor_commitment_amount ||
    !req.body.investor_wallet_address ||
    !req.body.investor_email
  ) {
    res.status(500).send({
      message: 'Required parameters are not present.',
      request: req.body
    })
    return
  }

  // data for investor creating
  const data = {
    user_id: -1,
    reviewed: false,
    investor_name: req.body.investor_name,
    investor_telegram_id: req.body.investor_telegram_id,
    investor_country: req.body.investor_country,
    investor_commitment_amount: req.body.investor_commitment_amount,
    investor_wallet_address: req.body.investor_wallet_address,
    investor_email: req.body.investor_email as string,
    investor_fund_name: req.body.investor_fund_name,
    investor_fund_website: req.body.investor_fund_website
  }

  const userCreated = await User.findOne({
    where: { email: req.body.investor_email }
  })

  if (userCreated) {
    data.user_id = userCreated.id
    data.reviewed = false

    const investorExist = await InvestorDetail.findOne({
      where: { user_id: userCreated.id }
    })

    // return error that investor already exists
    if (investorExist) {
      res.status(500).send({
        message: 'Investor for a specified e-mail already exists.'
      })
      return
    }

    const investorCreated = await InvestorDetail.create(data)

    // check if the profile was created successfully
    if (investorCreated) {
      res.send({
        message: 'Investor profile was created successfully.',
        status: 'created'
      })
    } else {
      res.status(500).send({
        message:
          'Internal error occurred (while creating investor profile), please take a look at the servers console.'
      })
    }
  } else {
    // todo should we create a new user for this investor?
  }
}

/**
 * Get profile
 *
 * TODO: add comment
 * TODO: check with this planned usage with dev team
 */
export const getProfile = (req: UserRequest, res: Response) => {
  const { email } = req.user

  User.findOne({ where: { email: email } })
    .then((data) => {
      // non-null-asserions will be fixed once input validation become finished in user controller as well
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const _returnData = [
        {
          email,
          remaining_total_amount: data?.remaining_total_amount || 0,
          locked_bonus_amount: data?.locked_bonus_amount || 0,
          user_name: data!.user_name,
          first_name: data!.first_name,
          last_name: data!.last_name,
          wallet_address: data!.wallet_address,
          telegram_id: data!.telegram_id,
          twitter_id: data!.twitter_id,
          enable_authenticator: data!.enable_authenticator,
          enable_sms: data!.enable_sms,
          enable_password: data!.enable_password
        }
      ]
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
      res.send(_returnData)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving users.'
      })
    })
}

/**
 * Method that gets investor details for a specific user.
 * @param req
 * @param res
 */
export const getInvestorDetails = async (req: UserRequest, res: Response) => {
  // check if user is assingned
  if (!req.user) {
    res.status(500).send({ message: 'User is not assigned.' })
    return
  }

  const userCheck = await User.findOne({ where: { email: req.user.email } })
  const investorDetails = await InvestorDetail.findOne({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    where: { user_id: userCheck!.id, reviewed: 1 }
  })

  // check if investor details are present
  if (investorDetails) {
    res.send(investorDetails.toJSON())
  } else {
    res.send({
      message:
        'Investor details are not present. Details were not submitted or reviewed yet.'
    })
  }
}

//Update profile
export const updateProfile = async (req: UserRequest, res: Response) => {
  const { email } = req.user

  if (!email) {
    res.status(400).send({
      message: 'Email is required!'
    })
    return
  }

  const data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name,
    telegram_id: req.body.telegram_id,
    twitter_id: req.body.twitter_id,
    wallet_address: req.body.wallet_address,
    enable_authenticator: req.body.enable_authenticator,
    enable_sms: req.body.enable_sms,
    enable_password: req.body.enable_password
  }

  User.update(data, {
    where: { email: email }
  })
    .then((result) => {
      if (result[0] === 1) {
        res.send({
          message: 'User profile was updated successfully.'
        })
      } else {
        res.send({
          message: `Cannot update User profile with username=${req.user.user_name}. Maybe User profile info was not found or req.body is empty!`
        })
      }
    })
    .catch((err) => {
      UserControllerLogger.error(err)
      res.status(500).send({
        message:
          'Error updating User profile with username=' + req.user.user_name
      })
    })
}

/** Upload profile Image */
export const uploadImg = async (req: UserRequest, res: Response) => {
  const { email } = req.user
  const { user_name, image_data } = req.body

  if (!email) {
    res.status(400).send({
      message: 'Email is required!'
    })
    return
  }

  //upload image data to S3
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  })
  await s3
    .createBucket({
      Bucket: 'strong-profile-img',
      ACL: 'public-read'
    })
    .promise()

  if (image_data !== undefined) {
    const base64Data = Buffer.from(
      image_data.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    )
    const image_type = image_data.split(';')[0].split('/')[1]
    let s3_image_url = ''
    let key = ''

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
      Bucket: 'strong-profile-img',
      Key: `${user_name}.${image_type}`,
      Body: base64Data,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: `image/${image_type}`
    }

    try {
      const { Location, Key } = await s3.upload(s3_params).promise()
      s3_image_url = Location
      key = Key
    } catch (error) {
      UserControllerLogger.error(error)
      res.status(500).send({
        message: 'Error uploading User profile image with username=' + user_name
      })
    }

    const data = {
      profile_img_type: image_type,
      profile_img_url: s3_image_url,
      profile_img_key: key
    }

    User.update(data, {
      where: { email: email }
    })
      .then((result) => {
        if (result[0] === 1) {
          res.send({
            message: 'User profile image was uploaded successfully.'
          })
        } else {
          res.send({
            message:
              'Cannot upload User profile image with username=' + user_name
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err
        })
      })
  }
}

/**
 * Method that requests support from members of SNE.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const createSupportRequest = async (req: UserRequest, res: Response) => {
  // validate request
  if (!req.body.subject || !req.body.message)
    return res
      .status(400)
      .send({ result: 'Required parameters are not present' })

  const user = await User.findOne({ where: { email: req.user.email } })

  if (!user)
    return res
      .status(500)
      .send({ result: 'Unexpected error. User is not in the database.' })

  // send email to SNE support
  const emailService = new EmailService(new AWS.SES(AWS_CONFIG()))
  try {
    await emailService.sendTemplate(
      EMAIL_CONFIG.supportTeamEmail,
      new SupportRequestTemplate(),
      {
        email: user.email,
        username: user.user_name,
        message: req.body.message
      }
    )

    // if email was sent correctly, create record in database
    const supportRequest = await SupportRequest.create({
      user_id: user.id,
      subject: req.body.subject,
      message: req.body.message
    })

    if (supportRequest) {
      res.send({ result: 'Success' })
    } else {
      res.status(500).send({ result: 'Unexpected error.' })
    }
  } catch (e) {
    res.status(500).send({ result: 'Unexpected error.' })
  }
}
