import * as kycAdminEndpoints from 'shared/endpoints/kycAdmin'
import { generateApiCalls } from './utils'

const rawCalls = generateApiCalls(kycAdminEndpoints)

const kycAdminService = {
  ...rawCalls
}

export default kycAdminService
