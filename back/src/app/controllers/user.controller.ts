import {
  User as userRepository,
  SupportRequest as supportRequestRepository,
  InvestorDetail as investorDetailRepository,
  UserWallets as userWalletsRepository
} from '../models'
import AWS from 'aws-sdk'
import { EmailService } from 'app/services/communication/EmailService'
import { AWS_CONFIG } from 'app/config/config'
import { apiResponse, notFoundError, success } from 'shared/endpoints/responses'
import { withResponse } from './utils'
import { InvestorDetailService } from 'app/services/user/InvestorDetailService'
import {
  AddOrUpdateWallet,
  CreateInvestor,
  CreateSupportRequest,
  GetInvestorDetails,
  GetProfile,
  GetUserWallets,
  UpdateProfile
} from 'shared/endpoints/user'
import { ProfileService } from 'app/services/user/ProfileService'
import { SupportRequestService } from 'app/services/user/SupportRequestService'
import { WalletService } from 'app/services/user/WalletService'

const emailService = new EmailService(new AWS.SES(AWS_CONFIG()))
const profileService = new ProfileService(userRepository)
const walletService = new WalletService(userRepository, userWalletsRepository)
const investorDetailService = new InvestorDetailService(
  investorDetailRepository,
  userRepository
)
const supportRequestService = new SupportRequestService(
  userRepository,
  supportRequestRepository,
  emailService
)

/** Method that is used for adding or updating user wallets */
export const addOrUpdateWallet = withResponse(async (req) => {
  const data = AddOrUpdateWallet.schema.parse(req.body)
  const result = await walletService.addOrUpdateWallet(
    req.user.email,
    data.wallet
  )
  switch (result) {
    case 'created':
      return success({ message: 'Wallet successfully created.' })
    case 'updated':
      return success({ message: 'Wallets successfully updated.' })
  }
})

/** Method that gets all user wallets */
export const getUserWallets = withResponse<GetUserWallets.Response>(
  async (req) => {
    const result = await walletService.getUserWallets(req.user.email)
    return success(result)
  }
)

/** Create InvestorDetails for the current user */
export const createInvestor = withResponse<CreateInvestor.Response>(
  async (req) => {
    const data = CreateInvestor.schema.parse(req.body)
    const result = await investorDetailService.create({
      ...data,
      investor_email: req.user.email
    })
    switch (result) {
      case 'investor-is-already-registered-error':
        return apiResponse('investor-is-already-registered-error', 400, {
          message: 'You have been already registered as investor.'
        })
      case 'success':
        return success({
          message: 'Investor profile was created successfully.',
          status: 'created' as const
        })
    }
  }
)

/** Method that gets InvestorDetails for a the current user */
export const getInvestorDetails = withResponse<GetInvestorDetails.Response>(
  async (req) => {
    const investorDetail = await investorDetailService.get(req.user.email)
    if (investorDetail) {
      return success({
        data: investorDetail
      })
    }

    return notFoundError({
      message:
        'Internal error occurred (while creating investor profile), please take a look at the servers console.'
    })
  }
)

/** Get User */
export const getProfile = withResponse<GetProfile.Response>(async (req) => {
  const user = await profileService.get(req.user.email)
  return success({
    data: user
  })
})

/** Update User */
export const updateProfile = withResponse<UpdateProfile.Response>(
  async (req) => {
    const data = UpdateProfile.schema.parse(req.body)
    const result = await profileService.update(
      req.user.email,
      req.user.user_name,
      data
    )
    // TODO: implement email verification and user_name validation so to make it updateable
    switch (result) {
      case 'unimplemented':
        return apiResponse('email-and-username-are-not-updateable-error', 400, {
          message:
            'Sorry, but currently you cannot update your email and user_name.'
        })
      case 'success':
        return success({ message: 'Successfully updated the profile' })
    }
  }
)

/** Method that requests support from members of SNE. */
export const createSupportRequest = withResponse<CreateSupportRequest.Response>(
  async (req) => {
    const data = CreateSupportRequest.schema.parse(req.body)
    supportRequestService.create(req.user.email, data)
    return success({
      message: 'Message is sent successfully.'
    })
  }
)
