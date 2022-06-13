const {
  CryptocurrencyDataService,
  availableScopes,
  scopeDays,
  tokensMetricsListIDs
} = require('../services/cryptocurrency/CryptocurrencyDataService')
const coingecko = require('coingecko-api')

const coinChartData = require('../models').StrongnodeCoinData
const coinMetricsData = require('../models').CoinMetricsData

const cryptocurrencyDataService = new CryptocurrencyDataService(coingecko)

/**
 * Method that is used for refreshing data for SNE token from Coingecko.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.refreshStrongnodeTokenData = async (req, res) => {
  const token = 'strongnode'

  if (!req.query.scope)
    return res
      .status(400)
      .send({ message: 'Request does not contain scope query parameter.' })

  if (!availableScopes.includes(req.query.scope))
    return res.status(400).send({
      message:
        'Scope query is unsupported. Supported scopes: "days", "weeks", "months" and "years."'
    })

  try {
    const data = await cryptocurrencyDataService.getTokenChartData(
      scopeDays[req.query.scope]
    )

    const checkScopedRecord = await coinChartData.findOne({
      where: { scope: req.query.scope, token: token }
    })

    if (!checkScopedRecord)
      await coinChartData.create({
        data: data,
        token: token,
        scope: req.query.scope
      })
    else
      await coinChartData.update(
        { data: data, scope: req.query.scope },
        { where: { scope: req.query.scope, token: token } }
      )

    return res.send({ message: 'succesfully refreshed' })
  } catch (err) {
    res.status(500).send({
      message:
        err.message || 'Some error occurred while adding data to database.'
    })
  }
}

/**
 * Method that is used for refreshing data for a specified crypto tokens.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.refreshTokenDataList = async (req, res) => {
  const data = await cryptocurrencyDataService.getTokenPrice(
    tokensMetricsListIDs
  )

  // save or update each of this token data
  if (data) {
    for (const el of Object.keys(data)) {
      const tokenUpdate = await coinMetricsData.update(
        {
          usdValue: Number(data[el].usd).toFixed(30),
          marketCap: Number(data[el].usd_market_cap).toFixed(30),
          dayVolume: Number(data[el].usd_24h_vol).toFixed(30),
          dayChange: Number(data[el].usd_24h_change).toFixed(30)
        },
        { where: { token: el } }
      )

      if (!tokenUpdate[0]) {
        const tokenDetails = await cryptocurrencyDataService.getTokenDetails(el)

        await coinMetricsData.create({
          token: el,
          usdValue: Number(data[el].usd).toFixed(30),
          marketCap: Number(data[el].usd_market_cap).toFixed(30),
          dayVolume: Number(data[el].usd_24h_vol).toFixed(30),
          dayChange: Number(data[el].usd_24h_change).toFixed(30),
          image: tokenDetails.data.image
        })
      }
    }
  }

  return res.send({
    message: 'Successfully updated.'
  })
}

/**
 * Method that is used for getting token data for the client.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getTokenChartData = async (req, res) => {
  let token = 'strongnode'

  if (!req.query.scope)
    return res.status(400).send({ message: 'Scope parameter is required.' })

  if (req.query.token) token = req.query.token

  const tokenData = await coinChartData.findOne({
    where: { token: token, scope: req.query.scope }
  })

  if (tokenData) return res.send(tokenData.data)
  else return res.status(500).send({ message: 'Token data were not found.' })
}

/**
 *  Method that returns all of the token metrics data.
 */
exports.getTokensMetrics = async (req, res) => {
  // todo add query option to get only one token
  const tokenMetrics = await coinMetricsData.findAll()
  return res.send(tokenMetrics)
}
