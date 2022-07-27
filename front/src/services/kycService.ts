import { fetchSseAPI } from './utils'
import * as kycEndpoints from 'shared/endpoints/kyc'

const kycService = {
  uploadIdentityPhoto: (
    data: kycEndpoints.UploadIdentityPhoto.Request
  ): AsyncIterableIterator<kycEndpoints.UploadIdentityPhoto.Response> =>
    fetchSseAPI(
      kycEndpoints.UploadIdentityPhoto.METHOD,
      kycEndpoints.UploadIdentityPhoto.PATH,
      data
    ),
  uploadUserWithIdentityPhoto: (
    data: kycEndpoints.UploadUserWithIdentityPhoto.Request
  ): AsyncIterableIterator<kycEndpoints.UploadUserWithIdentityPhoto.Response> =>
    fetchSseAPI(
      kycEndpoints.UploadUserWithIdentityPhoto.METHOD,
      kycEndpoints.UploadUserWithIdentityPhoto.PATH,
      data
    ),
  verifyIdentity: (
    data: kycEndpoints.VerifyIdentity.Request
  ): AsyncIterableIterator<kycEndpoints.VerifyIdentity.Response> =>
    fetchSseAPI(
      kycEndpoints.VerifyIdentity.METHOD,
      kycEndpoints.VerifyIdentity.PATH,
      data
    )
}

export default kycService
