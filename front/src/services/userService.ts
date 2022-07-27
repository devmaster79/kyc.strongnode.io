import * as userEndpoints from 'shared/endpoints/user'
import { generateApiCalls } from './utils'

export type MessageResult = {
  message: string
}

const rawCalls = generateApiCalls(userEndpoints)

/**
 * Method that adds or updates wallet of logged user.
 * @param wallet
 */
export async function addOrUpdateWallet(wallet: string | null | undefined) {
  if (wallet) {
    return await rawCalls.addOrUpdateWallet({ body: { wallet } })
  } else {
    return false
  }
}
const userService = {
  ...rawCalls,
  addOrUpdateWallet
}

export default userService
