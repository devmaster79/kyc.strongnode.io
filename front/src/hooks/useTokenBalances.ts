import { useCalls, ERC20Interface } from '@usedapp/core'
import { Contract, BigNumber } from 'ethers'

export function useTokenBalances(
  account: string | undefined,
  tokenAddresses: string[] | undefined
): (BigNumber | undefined)[] {
  const calls =
    tokenAddresses?.map((address) => ({
      contract: new Contract(address, ERC20Interface),
      method: 'balanceOf',
      args: [address]
    })) ?? []
  const results = useCalls(calls) ?? []
  results.forEach((result, idx) => {
    if (result && result.error) {
      console.error(
        `Error encountered calling 'balanceOf' on ${calls[idx]?.contract.address}: ${result.error.message}`
      )
    }
  })
  return results.map((result) => result?.value?.[0])
}
