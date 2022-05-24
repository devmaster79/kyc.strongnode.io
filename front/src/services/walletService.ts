import { getDefaultProvider } from 'ethers'
import { Polygon, Config, Mainnet } from '@usedapp/core'
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js'

interface IStringDictionary {
  [key: string]: string
}

interface IDictionary {
  [key: string]: string | boolean
}

/**
 * Token addresses' dictionary.
 */
export const tokenAddressDictionary: IStringDictionary = {
  strongnode: '0x32934CB16DA43fd661116468c1B225Fc26CF9A8c',
  'matic-network': '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'
}

/**
 * Network types dictionary.
 */
export const coinTypesDictionary: IDictionary = {
  strongnode: 'token',
  ethereum: 'ethereum',
  'matic-network': 'token',
  bitcoin: false
}

/**
 * RPC urls for a different networks.
 */
export const networksRpcDictionary: IStringDictionary = {
  polygon: 'https://polygon-rpc.com'
}

/**
 * Config object for DAppProvider
 * @type {Config}
 */
export const DAppProviderConfig = {
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    [Polygon.chainId]: networksRpcDictionary.polygon,
    [Mainnet.chainId]: getDefaultProvider('mainnet')
  },
  networks: [Polygon, Mainnet],
  autoConnect: true
}

/**
 * Method that evokes wallet Connect modal and connection.
 * When force parameters is set to true, we log out current wallet and then let user log with a different wallet.
 * @param force
 */
export const connectWallet = async (activate: any, force = false) => {
  // todo make the force force work
  try {
    const provider = new WalletConnectProvider({
      rpc: {
        [Polygon.chainId]: networksRpcDictionary.polygon
      },
      chainId: Polygon.chainId
    })

    // opens up the QR code
    await provider.enable()

    await activate(provider)
    return true
  } catch (error) {
    return false
  }
}
