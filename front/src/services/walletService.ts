import { getDefaultProvider } from 'ethers'
import { Polygon, Config, Mainnet } from '@usedapp/core'
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js'
import defaultTokenAddresses from './../contracts/defaultTokenDictionary.json'
import generatedTokenAddressDictionary from './../contracts/generated/tokenAddressDictionary.json'

// checking if .env file has setted localhost blockchain info
const usingLocalBlockchain: boolean =
  import.meta.env.VITE_APP_LOCAL_BLOCKCHAIN_RPC !== undefined &&
  import.meta.env.VITE_APP_LOCAL_BLOCKCHAIN_CHAIN_ID !== undefined

interface IStringDictionary {
  [key: string]: string
}

interface IDictionary {
  [key: string]: string | boolean
}

/**
 * Token addresses' dictionary.
 */
export const tokenAddressDictionary: IStringDictionary = usingLocalBlockchain
  ? generatedTokenAddressDictionary
  : defaultTokenAddresses

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
 * Config object for DAppProvider that uses localhost blockchain.
 */
const DAppReadOnlyUrlsLocalBlockchain = {
  [Number(import.meta.env.VITE_APP_LOCAL_BLOCKCHAIN_CHAIN_ID)]: import.meta.env
    .VITE_APP_LOCAL_BLOCKCHAIN_RPC
    ? import.meta.env.VITE_APP_LOCAL_BLOCKCHAIN_RPC
    : ''
}

/**
 * Config object for DAppProvider readOnlyUrls.
 */
const DAppReadOnlyUrls = {
  [Polygon.chainId]: networksRpcDictionary.polygon,
  [Mainnet.chainId]: getDefaultProvider('mainnet')
}

/**
 * Config object for DAppProvider
 * @type {Config}
 */
export const DAppProviderConfig: Config = {
  readOnlyChainId: usingLocalBlockchain
    ? Number(import.meta.env.VITE_APP_LOCAL_BLOCKCHAIN_CHAIN_ID)
    : Polygon.chainId,
  readOnlyUrls: usingLocalBlockchain
    ? DAppReadOnlyUrlsLocalBlockchain
    : DAppReadOnlyUrls,
  networks: [Polygon, Mainnet],
  autoConnect: true,
  supportedChains: [31337]
}

/**
 * Method that evokes wallet Connect modal and connection.
 * When force parameters is set to true, we log out current wallet and then let user log with a different wallet.
 * @param force
 */
export const connectWallet = async (
  activate: (p: WalletConnectProvider) => void,
  force = false
) => {
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

/**
 * Method that returns correct address dictionary.
 */
export const getTokenAddress = (token: string) => {
  return tokenAddressDictionary[token]
    ? tokenAddressDictionary[token]
    : undefined
}
