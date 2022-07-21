import { UserCredentials } from '@ui/dVPN/UserCredentials'
import UsageWidget from '@ui/Crypto/UsageWidget'
import * as DashboardStyle from '@ui/Dashboard/DashboardStyle'
import TableSection from 'components/TableSection/TableSection'

export default function DVPN() {
  return (
    <DashboardStyle.Wrapper>
      <DashboardStyle.Container>
        <h1 style={{ marginTop: '56px' }}>dVPN Usage</h1>
        <UsageWidget />
        <DashboardStyle.GridContainer>
          <DashboardStyle.Grid>
            <UserCredentials style={{ width: '100%', height: 'fit-content' }} />
          </DashboardStyle.Grid>
          <DashboardStyle.Grid>
            <TableSection
              comingSoon
              title="Billing History"
              subtitle="NFT 18"
            />
          </DashboardStyle.Grid>
        </DashboardStyle.GridContainer>
      </DashboardStyle.Container>
    </DashboardStyle.Wrapper>
  )
}
