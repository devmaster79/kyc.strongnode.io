import { useTokenBalance } from '@usedapp/core'

export const useTokenBalanceValidated = (tokenAddress: string, account: string) => {
  // todo validate the token address
  return useTokenBalance(tokenAddress, account)
}
