import { UserCredentials } from '@ui/dVPN/UserCredentials'
import UsageWidget from '@ui/Crypto/UsageWidget'
import * as DashboardStyle from '@ui/Dashboard/DashboardStyle'
import TableSection from 'components/TableSection/TableSection'
import Button from './../../../@ui/Button/Button'
import { Navigate } from 'react-router-dom'

export default function DVPN() {
  // <Navigate to={'/dashboard/app'} />
  // todo: remove the Navigate when we want to allow users to access this page
  // temporarily disabled, because we don't have stripe credentials
  return (
    <DashboardStyle.Wrapper>
      <Navigate to={'/dashboard/app'} />
      <DashboardStyle.Container>
        <DashboardStyle.TittleWrapper>
          <h1 style={{ paddingBottom: '0' }}>dVPN Usage</h1>
          <Button
            style={{
              marginLeft: 'auto',
              marginRight: '14px'
            }}>
            DOWNLOAD DVPN
          </Button>
        </DashboardStyle.TittleWrapper>
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
