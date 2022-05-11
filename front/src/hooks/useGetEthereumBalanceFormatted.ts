import { useEtherBalance } from '@usedapp/core'
import { ethers } from 'ethers'

/**
 * Returns the current balance of ethereum.
 */
export const useGetEthereumBalanceFormatted = (account: string | null | undefined, queryParams: object = {}) => {
  const tokenBalance = useEtherBalance(account, queryParams)
  return tokenBalance && ethers.utils.formatUnits(tokenBalance, 18)
}
