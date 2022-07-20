import { UserCredentials } from '../../../@ui/dVPN/UserCredentials'

import * as dVPNEndpoints from 'shared/endpoints/dvpn'
import { generateApiCalls } from 'services/utils'

const rawCalls = generateApiCalls(dVPNEndpoints)

export const DVPN = () => {
  rawCalls.getUsageData()
  return (
    <div>
      <UserCredentials style={{ width: '50%' }} />
    </div>
  )
}

export default DVPN
