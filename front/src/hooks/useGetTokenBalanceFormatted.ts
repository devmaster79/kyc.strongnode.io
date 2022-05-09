import { useTokenBalance } from '@usedapp/core'
import { ethers } from 'ethers'
import { tokenAddressDictionary } from '../services/walletService'

/**
 * Returns the current balance of specified token.
 */
export const useGetTokenBalanceFormatted = (account: string | null | undefined, tokenAddress: string = tokenAddressDictionary.strongnode, queryParams: object = {}) => {
  const tokenBalance = useTokenBalance(tokenAddress, account, queryParams)
  return tokenBalance && ethers.utils.formatUnits(tokenBalance, 18)
}
