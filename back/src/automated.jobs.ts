import { CryptocurrencyDataService } from './app/services/cryptocurrency/CryptocurrencyDataService'
import CoinGeckoApi from 'coingecko-api'
import { CoinMetricsData } from './app/models'

const SECOND = 1000

const cryptocurrencyDataService = new CryptocurrencyDataService(
  new CoinGeckoApi(),
  CoinMetricsData
)

// todo add the setIntervals there
setInterval(() => {
  console.log('first interval, here we go every 10 secs')
  // todo dont forget to uncomment the first interval ⬇️
  // cryptocurrencyDataService.refreshTokenList()
}, SECOND * 10)
