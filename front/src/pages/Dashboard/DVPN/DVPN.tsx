import { UserCredentials } from '@ui/dVPN/UserCredentials'
import UsageWidget from '@ui/Crypto/UsageWidget'
import * as DashboardStyle from '@ui/Dashboard/DashboardStyle'
import TableSection from 'components/TableSection/TableSection'
import Button from './../../../@ui/Button/Button'
import { DVPNAccessModal } from '../../../@ui/Modal/DVPNAccessModal'
import { useState, useEffect } from 'react'
import { hasAccess } from '../../../services/dvpnService'
import { Navigate } from 'react-router-dom'

export default function DVPN() {
  const [userAccess, setUserAccess] = useState(false)
  const [redirectToDashboard, setRedirectToDashboard] = useState(false)
  const [getAcccessModalOpened, setGetAccessModalOpened] = useState(false)

  useEffect(() => {
    const loadUserAccess = async () => {
      const access = await hasAccess()

      if (access.result === 'success') {
        setUserAccess(access.dvpnAccess)
        setGetAccessModalOpened(!access.dvpnAccess)
      }
    }

    // todo, load the user access
    loadUserAccess()
  }, [])

  return (
    <DashboardStyle.Wrapper>
      <DVPNAccessModal
        opened={getAcccessModalOpened}
        onClose={() => {
          // if false navigate to somewhere else
          if (!userAccess) setRedirectToDashboard(true)
          else setGetAccessModalOpened(false)
        }}
      />
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
      {redirectToDashboard && <Navigate to={'/dashboard/app'} />}
    </DashboardStyle.Wrapper>
  )
}
