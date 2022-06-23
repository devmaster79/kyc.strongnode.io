import {
  User as userRepository,
  SupportRequest as supportRequestRepository,
  InvestorDetail as investorDetailRepository,
  UserWallets as userWalletsRepository
} from '../models'
import { SES } from '@aws-sdk/client-ses'
import { EmailService } from 'app/services/communication/EmailService'
import { AWS_CONFIG } from 'app/config/config'
import {
  apiResponse,
  notFoundError,
  success,
  zodValidationError
} from 'shared/endpoints/responses'
import { withResponse } from './utils'
import { InvestorDetailService } from 'app/services/user/InvestorDetailService'
import {
  AddOrUpdateWallet,
  CreateInvestor,
  CreateSupportRequest,
  GetInvestorDetails,
  GetProfile,
  GetUserWallets,
  UpdateAvatar,
  UpdateProfile
} from 'shared/endpoints/user'
import { ProfileService } from 'app/services/user/ProfileService'
import { SupportRequestService } from 'app/services/user/SupportRequestService'
import { WalletService } from 'app/services/user/WalletService'
import { GravatarService } from 'app/services/GravatarService'

const emailService = new EmailService(new SES(AWS_CONFIG()))
const gravatarService = new GravatarService()
const profileService = new ProfileService(userRepository, gravatarService)
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
      investorEmail: req.user.email
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
        'Internal error occurred (while reading investor profile), please take a look at the servers console.'
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

    const { result, modifiedUser } = await profileService.update(
      req.user.email,
      req.user.username,
      data
    )

    switch (result) {
      // TODO: implement email verification and username validation so to make it updateable
      case 'unimplemented':
        return apiResponse('email-and-username-are-not-updateable-error', 400, {
          message:
            'Sorry, but currently you cannot update your email and user_name.'
        })
      case 'username-is-already-taken':
        return zodValidationError([
          {
            code: 'custom',
            path: ['username'],
            message: 'This username is already taken'
          }
        ])
      case 'success':
        if (!modifiedUser) return notFoundError({ message: 'User not found. ' })
        return success({
          body: modifiedUser,
          message: 'Successfully updated the profile'
        })
    }
    return notFoundError({
      message:
        'Internal error occurred (while updating user profile), please take a look at the servers console.'
    })
  }
)

/** Update User avatar*/
export const updateAvatar = withResponse<UpdateAvatar.Response>(async (req) => {
  const message = await profileService.updateAvatar(
    req.body.email,
    req.file as Express.MulterS3.File
  )
  if (message === 'success') {
    return success({
      message: 'Successfully updated the profile'
    })
  } else {
    return apiResponse('avatar-is-not-updateable-error', 400, {
      message: 'Cannot update avatar'
    })
  }
})

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
