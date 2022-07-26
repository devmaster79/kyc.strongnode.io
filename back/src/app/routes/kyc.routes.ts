import type { Express } from 'express'
import { MODE_FULL } from '../services/auth/TokenService.js'
import * as kyc from '../controllers/kyc.controller'
import auth from '../middleware/auth'
import {
  UploadIdentityPhoto,
  UploadUserWithIdentityPhoto,
  VerifyIdentity
} from 'shared/endpoints/kyc'

module.exports = (app: Express) => {
  const router = require('express').Router()
  router.post(
    UploadIdentityPhoto.PATH,
    auth(MODE_FULL),
    kyc.uploadIdentityPhoto
  )
  router.post(
    UploadUserWithIdentityPhoto.PATH,
    auth(MODE_FULL),
    kyc.uploadImageOfUserHoldingHisDocument
  )
  router.post(VerifyIdentity.PATH, auth(MODE_FULL), kyc.verifyIdentity)
  app.use(router)
}
