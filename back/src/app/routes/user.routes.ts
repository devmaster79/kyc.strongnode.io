import type { Express } from 'express'
import { MODE_FULL } from '../services/auth/TokenService.js'
import * as users from '../controllers/user.controller'
import auth from '../middleware/auth'
import { uploadFileMiddleWare } from 'app/middleware/upload'

module.exports = (app: Express) => {
  const router = require('express').Router()

  //profile
  router.put('/createInvestor', auth(MODE_FULL), users.createInvestor)
  router.get('/profile', auth(MODE_FULL), users.getProfile)
  router.put('/profile', auth(MODE_FULL), users.updateProfile)
  router.post(
    '/profile/image',
    auth(MODE_FULL),
    uploadFileMiddleWare.single('file'),
    users.updateAvatar
  )
  router.get(
    '/profile/getInvestorProfile',
    auth(MODE_FULL),
    users.getInvestorDetails
  )

  // support requests
  router.post(
    '/support/create-request',
    auth(MODE_FULL),
    users.createSupportRequest
  )

  // wallets
  router.get('/wallets', auth(MODE_FULL), users.getUserWallets)
  router.post('/wallets', auth(MODE_FULL), users.addOrUpdateWallet)

  app.use('/api/users', router)
}
