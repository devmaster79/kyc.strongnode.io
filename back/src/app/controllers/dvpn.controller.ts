import { withResponse } from './utils'
import {
  GenerateAccount,
  VerifyAccount,
  HasAccess,
  SaveUsageData,
  GetUsageData,
  CancelAccess
} from 'shared/endpoints/dvpn'
import { DVPNService, ICreatedAccess } from './../services/dvpn/dVPNService'
import { User as userRepository, dVPNAccess } from '../models'
import { notFoundError, success } from '../../shared/endpoints/responses'
import { TokenService, MODE_DVPN } from '../services/auth/TokenService'
import { dVPNUsage } from '../models'

const tokenService = new TokenService()

/**
 * Method that returns user's access to dVPN.
 */
export const hasAccess = withResponse<HasAccess.Response>(async (req) => {
  const user = await userRepository.findOne({
    where: { email: req.user.email }
  })

  if (user) {
    const dVPN = new DVPNService(user.id, dVPNAccess)
    const access = await dVPN.hasAccess(false)

    return success({
      dvpnAccess: access as boolean
    })
  } else {
    return notFoundError({ message: 'User not found. ' })
  }
})

/**
 * Method that verifies user's login access to dVPN.
 * Returns token for dVPN service usage.
 */
export const verifyLogin = withResponse<VerifyAccount.Response>(async (req) => {
  const data = VerifyAccount.schema.parse(req.body)
  const user = await userRepository.findOne({ where: { email: data.email } })

  if (user) {
    const dVPN = new DVPNService(user.id, dVPNAccess)
    const verifyLogin = await dVPN.verifyAccessPassword(data.password)

    if (verifyLogin) {
      const access = await dVPN.hasAccess()

      // todo add the message that user has not prepaid the dVPN
      let response: VerifyAccount.AccountDetail = {
        dvpnAccess: access as boolean
      }

      if (access)
        response.token = tokenService.generateToken(
          user.email,
          user.username,
          MODE_DVPN
        )

      if (!access)
        response = {
          ...response,
          message: 'User has not bought the dVPN product yet.'
        }

      return success(response)
    } else {
      // todo return error not verified
      return success({
        dvpnAccess: false,
        message: 'User credentials are not valid.'
      })
    }
  } else {
    return notFoundError({ message: 'User not found. ' })
  }
})

/**
 * Method that generates user's access to dVPN.
 */
export const generateAccess = withResponse<GenerateAccount.Response>(
  async (req) => {
    const user = await userRepository.findOne({
      where: { email: req.user.email }
    })

    if (user) {
      const dVPN = new DVPNService(user.id, dVPNAccess)
      const access = await dVPN.createAccess(true)

      if (access) {
        return success(access as ICreatedAccess)
      } else {
        // todo update this error
        return notFoundError({ message: 'Access not created.' })
      }
    } else {
      return notFoundError({ message: 'User not found. ' })
    }
  }
)

/**
 *  Method that save usage of user
 *  todo change the body email to the email from jwt
 */
export const savedVPNUsage = withResponse<SaveUsageData.Response>(
  async (req) => {
    const data = SaveUsageData.schema.parse(req.body)

    const user = await userRepository.findOne({
      where: { email: req.user.email }
    })

    if (user) {
      const result = await dVPNUsage.create({
        userId: user.id,
        bytesIn: data.bytesIn,
        bytesOut: data.bytesOut
      })

      return success({ data: result })
    } else {
      return notFoundError({ message: 'User not found. ' })
    }
  }
)

/**
 *  Method that returns usage of user
 */
export const getdVPNUsage = withResponse<GetUsageData.Response>(async (req) => {
  const user = await userRepository.findOne({
    where: { email: req.user.email }
  })

  if (user) {
    const usageData = await dVPNUsage.findAll({
      where: { userId: user.id }
    })

    return success({ data: usageData })
  } else {
    return notFoundError({ message: 'User not found. ' })
  }
})

/**
 * Method for canceling subscription.
 */
export const cancelAccess = withResponse<CancelAccess.Response>(async (req) => {
  const user = await userRepository.findOne({
    where: { email: req.user.email }
  })

  if (user) {
    const dVPN = new DVPNService(user.id, dVPNAccess)
    const canceled = await dVPN.disableAccess()

    if (canceled) {
      return success({
        canceled: true
      })
    } else {
      return notFoundError({ message: 'User access not found. ' })
    }
  } else {
    return notFoundError({ message: 'User not found. ' })
  }
})
