import { withResponse } from './utils'
import {
  GenerateAccount,
  GetUsageData,
  VerifyAccount,
  SaveUsageData
} from 'shared/endpoints/dvpn'
import { DVPNService, ICreatedAccess } from './../services/dvpn/dVPNService'
import { User as userRepository, dVPNAccess } from '../models'
import { notFoundError, success } from '../../shared/endpoints/responses'
import { dVPNUsage } from '../models'
/**
 * Method that verifies user's access to dVPN.
 */
export const verifyAccess = withResponse<VerifyAccount.Response>(
  async (req) => {
    const data = VerifyAccount.schema.parse(req.body)
    const user = await userRepository.findOne({ where: { email: data.email } })

    if (user) {
      const dVPN = new DVPNService(user.id, dVPNAccess)
      const access = await dVPN.verifyAccessPassword(
        data.password,
        user.password
      )

      return success({
        dvpnAccess: access
      })
    } else {
      return notFoundError({ message: 'User not found. ' })
    }
  }
)

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
 */
export const savedVPNUsage = withResponse<SaveUsageData.Response>(
  async (req) => {
    const data = SaveUsageData.schema.parse(req.body)

    const user = await userRepository.findOne({
      where: { email: data.email }
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
