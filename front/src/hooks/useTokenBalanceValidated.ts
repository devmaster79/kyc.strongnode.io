import { useTokenBalance } from '@usedapp/core'

export const useTokenBalanceValidated = (
  tokenAddress: string,
  account: string | null | undefined
) => {
  // todo validate the token address
  return useTokenBalance(tokenAddress, account)
}
