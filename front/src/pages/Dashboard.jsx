import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useEffect, useCallback, useRef, useState } from 'react'
import userService from '../services/userService'
import { Banner } from '../@ui/Banner/Banner'
import authService from 'services/auth'
import TableSection from 'components/TableSection/TableSection'
import { CoinMetrics } from '../@ui/Table/CoinMetrics'
import { CryptoWidget } from '../@ui/Crypto/CryptoWidget'
import * as DashboardStyle from '@ui/Dashboard/DashboardStyle'
import { useEthers } from '@usedapp/core'
import { LastTransactions } from '../@ui/Crypto/LastTransactions'

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar()
  const { account } = useEthers()
  const navigate = useNavigate()

  const handleDashboard = useCallback(async () => {
    if (localStorage.getItem('visit') !== 'true') {
      enqueueSnackbar('Welcome to the StrongNodeID dashboard', {
        variant: 'success'
      })
      localStorage.setItem('visit', 'true')
    }
  }, [enqueueSnackbar])

  const dash = useRef()
  useEffect(() => {
    handleDashboard()
  }, [dash, handleDashboard])

  const signOut = useCallback(() => {
    authService.signOut()
    navigate('/verify-email')
  }, [navigate])

  const token = localStorage.getItem('token')
  const useremail = localStorage.getItem('email')

  useEffect(() => {
    async function fetch() {
      const userResult = await userService.getProfile()

      if (!userResult.data) {
        console.error('Cannot get the user object! Please, try to relogin.')
        signOut()
      }
    }

    fetch()
  }, [token, useremail, signOut])

  return (
    <DashboardStyle.Wrapper>
      <DashboardStyle.Container ref={dash}>
        <Banner
          title="StrongNode dVPN coming soon."
          description="Stay tuned for more information."
          soon
        />
        <h1 style={{ marginTop: '56px' }}>DeFi Dashboard</h1>
        <CryptoWidget />
        <DashboardStyle.GridContainer>
          <DashboardStyle.Grid>
            <CoinMetrics title="Coin metrics" hideHeading />
          </DashboardStyle.Grid>
          <DashboardStyle.Grid>
            <LastTransactions address={account ? account : ''} />
          </DashboardStyle.Grid>
        </DashboardStyle.GridContainer>
        <DashboardStyle.GridContainer>
          <DashboardStyle.Grid>
            <TableSection
              comingSoon
              title="Farming Metrics"
              subtitle="NFT 18"
            />
          </DashboardStyle.Grid>
        </DashboardStyle.GridContainer>
      </DashboardStyle.Container>
    </DashboardStyle.Wrapper>
  )
}
