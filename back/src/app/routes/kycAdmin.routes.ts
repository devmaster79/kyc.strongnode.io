import type { Express } from 'express'
import { MODE_FULL } from '../services/auth/TokenService.js'
import * as kycAdmin from '../controllers/kycAdmin.controller'
import auth from '../middleware/auth'
import {
  ApproveVerificationRequest,
  GetVerificationRequest,
  ListVerificationRequests,
  RejectVerificationRequest
} from 'shared/endpoints/kycAdmin'

module.exports = (app: Express) => {
  const router = require('express').Router()
  router.get(
    ListVerificationRequests.PATH,
    auth(MODE_FULL),
    kycAdmin.listVerificationRequests
  )
  router.get(
    GetVerificationRequest.PATH(GetVerificationRequest.PARAMS),
    auth(MODE_FULL),
    kycAdmin.getVerificationRequests
  )
  router.post(
    ApproveVerificationRequest.PATH(ApproveVerificationRequest.PARAMS),
    auth(MODE_FULL),
    kycAdmin.approve
  )
  router.post(
    RejectVerificationRequest.PATH(RejectVerificationRequest.PARAMS),
    auth(MODE_FULL),
    kycAdmin.reject
  )
  app.use(router)
}
