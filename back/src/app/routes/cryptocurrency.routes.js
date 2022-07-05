const { MODE_FULL } = require('../services/auth/TokenService.js')
const cryptocurrency = require('../controllers/cryptocurrency.controller')
const auth = require('../middleware/auth')

module.exports = (app) => {
  const router = require('express').Router()
  router.get('/chart', auth(MODE_FULL), cryptocurrency.getTokenChartData)
  router.get('/token-metrics', auth(MODE_FULL), cryptocurrency.getTokensMetrics)

  app.use('/api/cryptocurrency', router)
}
