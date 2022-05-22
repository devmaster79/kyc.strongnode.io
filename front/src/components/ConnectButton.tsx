import Button from '../@ui/Button/Button'
import { useEthers, shortenIfAddress } from '@usedapp/core'
import { connectWallet } from '../services/walletService'
import { addOrUpdateUserWallet } from '../services/userService'
import { useEffect } from 'react'

export const ConnectButton = () => {
  const { activate, deactivate, account } = useEthers()

  useEffect(() => {
    if (account) {
      addOrUpdateUserWallet(account)
    }
  }, [account])

  // todo this fragment of code will be in wallet carousel too
  // todo its duplicated since callback for WalletConnect (maticnetwork does not work)

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
            connectWallet(activate)
          }}>
          Connect Wallet
        </Button>
      )}
    </>
  )
}
