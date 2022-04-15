const db = require("../models");
const { CryptocurrencyDataService, availableScopes, scopeDays, tokensMetricsListIDs } = require('../services/cryptocurrency/CryptocurrencyDataService')
const coingecko = require('coingecko-api')

const coinChartData = require('../models').StrongnodeCoinData;

const cryptocurrencyDataService = new CryptocurrencyDataService(coingecko)

exports.test = async (req, res) => {
  // todo
  const data = await cryptocurrencyDataService.getTokenChartData()

  res.send(data)
}

/**
 * Method that is used for refreshing data for SNE token from Coingecko.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.refreshStrongnodeTokenData = async (req, res) => {
  const token = 'strongnode'

  if (!req.query.scope)
    return res.send('Common chap, give me the correct parameters.')

  if (!availableScopes.includes(req.query.scope))
    return res.send('unsupported scope.')

  const data = await cryptocurrencyDataService.getTokenChartData(scopeDays[req.query.scope])

  const checkScopedRecord = await coinChartData.findOne({where: {scope: req.query.scope, token: token}})

  if (!checkScopedRecord)
    await coinChartData.create({ data: data, token: token, scope: req.query.scope })
  else
    await coinChartData.update({ data: data, scope: req.query.scope }, {where: {scope: req.query.scope, token: token}})

  return res.send({message: 'succesfully refreshed'})
}

/**
 * Method that is used for refreshing data for a specified crypto tokens.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.refreshTokenDataList = async (req, res) => {
  const data = await
}

/**
 * Method that is used for getting token data for the client.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getTokenData = async (req, res) => {
  let token = 'strongnode'

  if (!req.query.scope)
    return res.send({status: 'error', message: 'scope parameter required'})

  if (req.query.token)
    token = req.query.token

  const tokenData = await coinChartData.findOne({where: {token: token, scope: req.query.scope}})

  if (tokenData)
    return res.send(tokenData.data)
  else
    return res.send({status: 'error', message: 'Token data were not found.'})
}
