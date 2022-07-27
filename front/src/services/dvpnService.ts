import { generateApiCalls } from './utils'
import * as dvpnEndpoints from 'shared/endpoints/dvpn'

const rawCalls = generateApiCalls(dvpnEndpoints)

/**
 * Method that generates/regenerates user's dVPN account.
 */
export async function generateAccount() {
  return rawCalls.generateAccount({})
}

/**
 * Method that checks if user has a dVPN access.
 */
export async function hasAccess() {
  return rawCalls.hasAccess({})
}

/**
 * Method that cancels the users access.
 */
export async function cancelAccess() {
  return rawCalls.cancelAccess({})
}
