import axios, { AxiosResponse } from 'axios'

export type GetProfileResult = {
  email: string
  remaining_total_amount: number
  locked_bonus_amount: number
  user_name: string
  first_name: string
  last_name: string
  wallet_address: string
  telegram_id: string
  twitter_id: string
  profile_img_url: string
  enable_authenticator: boolean
  enable_sms: boolean
  enable_password: boolean
}[]

const userProfileURL = '/api/users/profile'
export function getProfile(): Promise<
  AxiosResponse<GetProfileResult, unknown>
> {
  return axios.get(userProfileURL)
}
export function createProfile(data: CreateProfileDTO) {
  return axios.post(userProfileURL, data)
}
export function updateProfile(data: UpdateProfileDTO) {
  return axios.put(userProfileURL, data)
}

export interface GetInvestorDetailsResult {
  id: number
  user_id: number
  references: unknown
  investor_name: string
  investor_telegram_id: string
  investor_country: string
  investor_commitment_amount: number
  investor_wallet_address: string
  investor_email: string
  investor_fund_name: string
  investor_fund_website: string
  reviewed: boolean
  createdAt: number
  updatedAt: number
}

export function getInvestorDetails(): Promise<
  AxiosResponse<GetInvestorDetailsResult, unknown>
> {
  return axios.get('/api/users/profile/getInvestorProfile')
}

export interface CreateProfileDTO {
  telegram_id: string
  twitter_id: string
  wallet_address: string
}

export interface CreateInvestorDTO {
  investor_name: string
  investor_telegram_id: string
  investor_country: string
  investor_commitment_amount: number
  investor_wallet_address: string
  investor_email: string
  investor_fund_name: string
  investor_fund_website: string
}

export function createInvestor(data: CreateInvestorDTO) {
  return axios.put('/api/users/createInvestor', data)
}

export interface UpdateProfileDTO {
  first_name?: string
  last_name?: string
  user_name?: string
  telegram_id?: string
  twitter_id?: string
  wallet_address?: string
  enable_authenticator?: boolean
  enable_sms?: boolean
  enable_password?: boolean
}

export function uploadProfileImage(
  email: string,
  username: string,
  image: string
) {
  return axios.put('/api/users/profile/image', {
    email,
    userName: username,
    imageData: image
  })
}

export interface CreateSupportRequestDTO {
  message: string
  subject: string
}

export function createSupportRequest(data: CreateSupportRequestDTO) {
  return axios.post('/api/users/support/create-request', data)
}

/** @deprecated */
const UserService = {
  getProfile,
  getInvestorDetails,
  createProfile,
  createInvestor,
  updateProfile,
  uploadProfileImage,
  createSupportRequest
}

export default UserService
