import Button from '../@ui/Button/Button'
import { useEthers } from '@usedapp/core'
import { ConnectWallet } from '../services/walletService'

export const ConnectButton = () => {
  const { activate, deactivate, account } = useEthers()

  return (
    <>
      {account
        ? (
          <Button variant='normal' onClick={() => { deactivate() }}>
            {`${account.slice(0, 6)}...${account.slice(-6)}`}
          </Button>
          )
        : (
          <Button variant='normal' onClick={() => { ConnectWallet(activate) }}>
            Connect Wallet
          </Button>
          )}
    </>
  )
}
