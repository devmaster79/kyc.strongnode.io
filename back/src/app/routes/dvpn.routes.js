import {
  verifyLogin,
  generateAccess,
  savedVPNUsage,
  getdVPNUsage,
  hasAccess,
  cancelAccess
} from '../controllers/dvpn.controller'
const { MODE_FULL, MODE_DVPN } = require('../services/auth/TokenService.js')
const auth = require('../middleware/auth')

module.exports = (app) => {
  const router = require('express').Router()

  router.get('/access', auth(MODE_FULL), hasAccess)
  router.put('/access', auth(MODE_FULL), generateAccess)
  router.delete('/access', auth(MODE_FULL), cancelAccess)
  router.post('/verify', verifyLogin)

  router.post('/usage', auth(MODE_DVPN), savedVPNUsage)
  router.get('/usage', auth(MODE_FULL), getdVPNUsage)

  app.use('/api/dvpn', router)
}
