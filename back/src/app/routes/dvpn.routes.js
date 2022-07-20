import {
  verifyAccess,
  generateAccess,
  savedVPNUsage,
  getdVPNUsage
} from '../controllers/dvpn.controller'
const { MODE_FULL } = require('../services/auth/TokenService.js')
const auth = require('../middleware/auth')

module.exports = (app) => {
  const router = require('express').Router()

  router.get('/generate', auth(MODE_FULL), generateAccess)
  router.post('/verify', verifyAccess)
  router.post('/usage', savedVPNUsage)
  router.get('/usage', auth(MODE_FULL), getdVPNUsage)

  app.use('/api/dvpn', router)
}
