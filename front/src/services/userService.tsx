import axios from 'axios'
import {
  CreateInvestor,
  CreateSupportRequest,
  GetInvestorDetails,
  GetProfile,
  UpdateProfile
} from 'shared/endpoints/user'
import { fetchAPI } from './utils'

export type MessageResult = {
  message: string
}

const userProfileURL = '/api/users/profile'
const userWallets = '/api/users/wallets'

export async function getProfile() {
  return await fetchAPI<GetProfile.Request, GetProfile.Response>(
    'get',
    userProfileURL
  )
}

export async function updateProfile(params: UpdateProfile.Request['body']) {
  return await fetchAPI<UpdateProfile.Request, UpdateProfile.Response>(
    'put',
    userProfileURL,
    params
  )
}

export async function getInvestorDetails() {
  return await fetchAPI<
    GetInvestorDetails.Request,
    GetInvestorDetails.Response
  >('get', '/api/users/createInvestor')
}

export async function createInvestor(params: CreateInvestor.Request['body']) {
  return await fetchAPI<CreateInvestor.Request, CreateInvestor.Response>(
    'put',
    '/api/users/createInvestor',
    params
  )
}

export async function createSupportRequest(
  params: CreateSupportRequest.Request['body']
) {
  return await fetchAPI<
    CreateSupportRequest.Request,
    CreateSupportRequest.Response
  >('put', '/api/users/createInvestor', params)
}

/**
 * Method that gets list of wallets from BE of logged user.
 */
export function getUserWallet() {
  return axios.get(userWallets)
}

/**
 * Method that adds or updates wallet of logged user.
 * @param wallet
 */
export function addOrUpdateUserWallet(wallet: string | null | undefined) {
  if (wallet) {
    return axios.post(userWallets, { wallet })
  } else {
    return false
  }
}
