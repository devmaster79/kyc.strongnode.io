import type { Express } from 'express'
import { MODE_FULL } from '../services/auth/TokenService.js'
import * as kyc from '../controllers/kyc.controller'
import auth from '../middleware/auth'
import {
  UploadIdentityPhoto,
  UploadUserWithIdentityPhoto,
  VerifyIdentity
} from 'shared/endpoints/kyc'
import { identityVerificationLimit } from 'app/middleware/limits'

module.exports = (app: Express) => {
  const router = require('express').Router()
  router.post(
    UploadIdentityPhoto.PATH,
    auth(MODE_FULL),
    identityVerificationLimit.limiter,
    kyc.uploadIdentityPhoto
  )
  router.post(
    UploadUserWithIdentityPhoto.PATH,
    auth(MODE_FULL),
    identityVerificationLimit.limiter,
    kyc.uploadImageOfUserHoldingHisDocument
  )
  router.post(
    VerifyIdentity.PATH,
    auth(MODE_FULL),
    identityVerificationLimit.limiter,
    kyc.verifyIdentity
  )
  app.use(router)
}
