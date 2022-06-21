import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useEffect, useCallback, useRef } from 'react'
import userService from '../services/userService'
import { Banner } from '../@ui/Banner/Banner'
import authService from 'services/auth'
import TableSection from 'components/TableSection/TableSection'
import { CoinMetrics } from '../@ui/Table/CoinMetrics'
import styled from '@emotion/styled'
import Media from './../theme/mediaQueries'
import { CryptoWidget } from '../@ui/Crypto/CryptoWidget'

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar()
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
      await userService.getInvestorDetails()

      if (!userResult.data) {
        console.error('Cannot get the user object! Please, try to relogin.')
        signOut()
      }
    }

    fetch()
  }, [token, useremail, signOut])

  return (
    <Wrapper>
      <Container ref={dash}>
        <Banner
          title="StrongNode dVPN coming soon."
          description="Stay tuned for more information."
          soon
        />
        <h1 style={{ marginTop: '56px' }}>DeFi Dashboard</h1>
        <CryptoWidget />
        <GridContainer>
          <Grid>
            <CoinMetrics title="Coin Metrics" hideHeading />
          </Grid>
          <Grid>
            <TableSection
              comingSoon
              title="Farming Metrics"
              subtitle="NFT 18"
            />
          </Grid>
        </GridContainer>
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
})

const Container = styled.div({
  maxWidth: '1536px',
  width: '100%',
  paddingBottom: '100px',
  marginTop: '70px'
})

const GridContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingRight: '5px',

  [Media.tablet]: {
    paddingRight: '15px',
    flexDirection: 'column',
    margin: '0px'
  },
  [Media.phone]: {
    paddingRight: '0px'
  }
})

const Grid = styled.div({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  margin: '10px',

  [Media.tablet]: {
    flexDirection: 'column',
    margin: '0px'
  }
})
