import React from 'react'
import { useGetEthereumBalanceFormatted } from '../../../hooks/useGetEthereumBalanceFormatted'
import { useEthers } from '@usedapp/core'

type UserOwnedEthereumProps = {
  default: string
}

export const UserOwnedEthereum = (props: UserOwnedEthereumProps) => {
  const { account } = useEthers()
  const ownedTokens = useGetEthereumBalanceFormatted(account)

  return (
    <span>
      {ownedTokens || props.default}
    </span>
  )
}
