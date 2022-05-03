import { Polygon, Config, useTokenBalance } from '@usedapp/core'
import WalletConnectProvider from '@maticnetwork/walletconnect-provider'
import { addOrUpdateUserWallet } from './userService'
import { ethers } from 'ethers'

/**
 * SNE wallet address
 * @type {string}
 */
export const SneAddress = '0x32934CB16DA43fd661116468c1B225Fc26CF9A8c'

/**
 * Config object for DAppProvider
 * @type {Config}
 */
export const DAppProviderConfig = {
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    [Polygon.chainId]: 'https://polygon-rpc.com'
  },
  networks: [Polygon]
}

/**
 * Returns the current balance of specified token.
 */
export const useGetTokenBalance = (account: string | null | undefined, tokenAddress: string = SneAddress) => {
  console.log('used get token balance from walletService')
  const tokenBalance = useTokenBalance(tokenAddress, account)
  console.log(tokenBalance && ethers.utils.formatUnits(tokenBalance, 18))
  return tokenBalance && ethers.utils.formatUnits(tokenBalance, 18)
}

/**
 * Method that evokes wallet Connect modal and connection.
 * When force parameters is set to true, we log out current wallet and then let user log with a different wallet.
 * @param force
 */
export const ConnectWallet = async (activate: any, force = false) => {
  // todo make the force switcher work
  // todo assign events to the provider
  try {
    const provider = new WalletConnectProvider({
      host: 'https://polygon-rpc.com',
      onConnect: () => {
        // connected
      },
      onDisconnect: () => {}
    })

    await activate(provider)
  } catch (error) {
    console.error(error)
  }
}
