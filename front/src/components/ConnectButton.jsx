import Button from '../@ui/Button/Button'
import { useEthers, useTokenBalance } from '@usedapp/core'
import { ethers } from 'ethers'

const SneAddress = '0x32934CB16DA43fd661116468c1B225Fc26CF9A8c'

export function SneBalance() {
  const { account } = useEthers()

  const SneBalanceBigNumber = useTokenBalance(SneAddress, account)
  return (
    SneBalanceBigNumber && ethers.utils.formatUnits(SneBalanceBigNumber, 18)
  )
}

export default function ConnectButton() {
  const { account } = useEthers()

  const activateBrowserWalletUser = async () => {
    window.location.reload()
  }

  const deactivateUser = async () => {
    window.location.reload()
  }
  return (
    <>
      {account ? (
        <Button variant="contained" onClick={() => deactivateUser}>
          {`${account.slice(0, 6)}...${account.slice(-6)}`}
        </Button>
      ) : (
        <Button variant="contained" onClick={activateBrowserWalletUser}>
          Connect Wallet
        </Button>
      )}
    </>
  )
}
