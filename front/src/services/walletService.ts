import { Polygon, Config } from '@usedapp/core'
import WalletConnectProvider from '@maticnetwork/walletconnect-provider/dist/walletconnect-provider.umd'

interface IStringDictionary {
  [key:string]: string
}

interface IDictionary {
  [key:string]: string | boolean
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
    [Polygon.chainId]: networksRpcDictionary.polygon
  },
  networks: [Polygon],
  autoConnect: true
}

/**
 * Method that evokes wallet Connect modal and connection.
 * When force parameters is set to true, we log out current wallet and then let user log with a different wallet.
 * @param force
 */
export const ConnectWallet = async (activate: any, force = false) => {
  // todo make the force force work
  try {
    const provider = new WalletConnectProvider({
      host: networksRpcDictionary.polygon,
      callbacks: {
        onConnect: (err: any, payload: any) => {
          // todo, callbacks does not work, but provider returns true on .isConnected()
        },
        onDisconnect: () => {
          // todo, callbacks does not work, but provider returns true on .isConnected()
        }
      }
    })
    await activate(provider)
    return true
  } catch (error) {
    return false
  }
}
