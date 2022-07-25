import {
  verifyLogin,
  generateAccess,
  savedVPNUsage,
  getdVPNUsage,
  hasAccess
} from '../controllers/dvpn.controller'
const { MODE_FULL } = require('../services/auth/TokenService.js')
const auth = require('../middleware/auth')

module.exports = (app) => {
  const router = require('express').Router()

  router.get('/access', auth(MODE_FULL), hasAccess)
  router.put('/access', auth(MODE_FULL), generateAccess)
  router.post('/verify', verifyLogin)

  router.post('/usage', savedVPNUsage)
  router.get('/usage', auth(MODE_FULL), getdVPNUsage)

  app.use('/api/dvpn', router)
}
