import Button from '../@ui/Button/Button'
import { useEthers, shortenIfAddress } from '@usedapp/core'
import userService from '../services/userService'
import { useEffect } from 'react'

interface IConnectButton {
  onClick: () => void
}

export const ConnectButton = (props: IConnectButton) => {
  const { deactivate, account } = useEthers()

  useEffect(() => {
    if (account) {
      userService.addOrUpdateWallet(account)
    }
  }, [account])

  return (
    <>
      {account ? (
        <Button
          variant="normal"
          onClick={() => {
            deactivate()
          }}>
          {shortenIfAddress(account)}
        </Button>
      ) : (
        <Button
          variant="normal"
          onClick={() => {
            props.onClick()
          }}>
          Connect Wallet
        </Button>
      )}
    </>
  )
}
