import React from 'react'
import { useGetTokenBalanceFormatted } from '../../../hooks/useGetTokenBalanceFormatted'
import { useEthers } from '@usedapp/core'

type UserOwnedTokensProps = {
  tokenAddress: string,
  default: string
}

export const UserOwnedTokens = (props: UserOwnedTokensProps) => {
  const { account } = useEthers()
  const ownedTokens = useGetTokenBalanceFormatted(account, props.tokenAddress)

  return (
    <span>
      {ownedTokens || props.default}
    </span>
  )
}
