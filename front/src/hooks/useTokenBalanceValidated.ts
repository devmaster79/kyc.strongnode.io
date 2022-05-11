import { useTokenBalance } from '@usedapp/core'

export const useTokenBalanceValidated = (tokenAddress: string, account: string | null | undefined) => {
  if (!account) { return undefined }

  // todo validate the token address
  return useTokenBalance(tokenAddress, account)
}
