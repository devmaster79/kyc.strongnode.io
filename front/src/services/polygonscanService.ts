import axios from 'axios'

const axiosInstance = axios.create()
delete axiosInstance.defaults.headers.common.Authorization

const baseUrl = 'https://api.polygonscan.com/api'

const ACTION_LAST_TRANSACTIONS = 'txlist'

export interface IGetLastTransactions {
  module: string
  address: string
  page: number
  offset: number
  sort: string
  startblock?: number
  endblock?: number
}

export interface IGetLastTransactionsResponseResultObject {
  [key: string]: string
}

export interface IGetLastTransactionsResponse {
  status: string
  message: string
  result: Array<IGetLastTransactionsResponseResultObject>
}

/**
 * Method that gets account's last transactions.
 * @param account
 * @param parameters
 */
export const getAccountsLastTransactions = async (
  parameters: IGetLastTransactions
) => {
  let url = getApiUrl(ACTION_LAST_TRANSACTIONS)

  for (const [key, value] of Object.entries(parameters)) {
    url += `&${key}=${value}`
  }

  const result = await axiosInstance.get(url)

  if (result.status === 200) return result.data as IGetLastTransactionsResponse
  else return null
}

/**
 * Method that gets base API url with apiKey and action.
 * @param action
 */
export const getApiUrl = (action: string) => {
  return `${baseUrl}?action=${action}&apikey=${
    import.meta.env.VITE_APP_POLYGONSCAN_API_KEY
  }`
}
