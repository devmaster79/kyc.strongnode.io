import {
  KycEntry as kycEntryRepository,
  User as userRepositroy
} from 'app/models'
import { KycAdminService } from 'app/services/KYC/KycAdminService'
import {
  checksumMismatchError,
  notFoundError,
  success
} from 'shared/endpoints/responses'
import {
  GetVerificationRequest,
  ListVerificationRequests,
  ApproveVerificationRequest,
  RejectVerificationRequest
} from 'shared/endpoints/kycAdmin'
import { withResponse } from './utils'
import { FileService } from 'app/services/FileService'
import { S3 } from '@aws-sdk/client-s3'
import { AWS_S3_CONFIG, AWS_SES_CONFIG } from 'app/config/config'
import { EmailService } from 'app/services/communication/EmailService'
import { SES } from '@aws-sdk/client-ses'
import { ChecksumService } from 'app/services/ChecksumService'

const kycAdminService = new KycAdminService(
  kycEntryRepository,
  userRepositroy,
  new FileService(new S3(AWS_S3_CONFIG)),
  new EmailService(new SES(AWS_SES_CONFIG()))
)
const checksumService = new ChecksumService()

export const listVerificationRequests =
  withResponse<ListVerificationRequests.Response>(async () => {
    return success({
      requests: await kycAdminService.listVerificationRequests()
    })
  })

export const getVerificationRequests =
  withResponse<GetVerificationRequest.Response>(async (req) => {
    const id = parseInt(req.params.requestId)
    const request = await kycAdminService.getVerificationRequests(id)
    if (!request) return notFoundError({ message: 'Wrong request id' })
    return success({ request, checksum: checksumService.from(request) })
  })

const REQUEST_CHECKSUM_MISMATCH_ERROR_MESSAGE =
  'Meanwhile the user changed the request, please review it again.'

export const approve = withResponse<ApproveVerificationRequest.Response>(
  async (req) => {
    const data = ApproveVerificationRequest.schema.parse(req.body)
    const id = parseInt(req.params.requestId)
    const actualRequest = await kycAdminService.getVerificationRequests(id)
    if (!actualRequest) return notFoundError({ message: 'Wrong request id' })
    const actualChecksum = checksumService.from(actualRequest)
    if (data.checksum !== actualChecksum)
      return checksumMismatchError({
        message: REQUEST_CHECKSUM_MISMATCH_ERROR_MESSAGE,
        request: actualRequest,
        checksum: actualChecksum
      })
    await kycAdminService.approve(id)
    return success({ message: 'Approved successfully!' })
  }
)

export const reject = withResponse<RejectVerificationRequest.Response>(
  async (req) => {
    const data = RejectVerificationRequest.schema.parse(req.body)
    const id = parseInt(req.params.requestId)
    const actualRequest = await kycAdminService.getVerificationRequests(id)
    if (!actualRequest) return notFoundError({ message: 'Wrong request id' })
    const actualChecksum = checksumService.from(actualRequest)
    if (data.checksum !== actualChecksum)
      return checksumMismatchError({
        message: REQUEST_CHECKSUM_MISMATCH_ERROR_MESSAGE,
        request: actualRequest,
        checksum: actualChecksum
      })
    await kycAdminService.reject(id, data.reason)
    return success({ message: 'Rejected successfully!' })
  }
)
