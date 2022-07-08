import { verifyAccess, generateAccess } from '../controllers/dvpn.controller'
import { MODE_FULL } from '../services/auth/TokenService.js'
import auth from '../middleware/auth'

module.exports = (app) => {
  const router = require('express').Router()

  router.get('/generate', auth(MODE_FULL), generateAccess)
  router.post('/verify', verifyAccess)

  app.use('/api/dvpn', router)
}
