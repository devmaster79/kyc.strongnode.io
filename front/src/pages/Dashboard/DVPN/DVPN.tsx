import { UserCredentials } from '@ui/dVPN/UserCredentials'
import UsageWidget from '@ui/Crypto/UsageWidget'
import * as DashboardStyle from '@ui/Dashboard/DashboardStyle'

export default function DVPN() {
  return (
    <DashboardStyle.Wrapper>
      <DashboardStyle.Container>
        <h1 style={{ marginTop: '56px' }}>dVPN Usage</h1>
        <UsageWidget />
        <DashboardStyle.GridContainer>
          <DashboardStyle.Grid>
            <UserCredentials style={{ width: '50%' }} />
          </DashboardStyle.Grid>
        </DashboardStyle.GridContainer>
      </DashboardStyle.Container>
    </DashboardStyle.Wrapper>
  )
}
