import { useTokenBalance } from '@usedapp/core'
import { ethers } from 'ethers'

/**
 * Returns the current balance of specified token.
 */
export const useGetTokenBalanceFormatted = (
  account: string | null | undefined,
  tokenAddress?: string | null | undefined,
  queryParams: object = {}
) => {
  const tokenBalance = useTokenBalance(tokenAddress, account, queryParams)
  return tokenBalance && ethers.utils.formatUnits(tokenBalance, 18)
}
