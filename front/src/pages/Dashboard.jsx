import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { useEffect, useCallback, useRef } from 'react'
import userService from '../services/userService'
import { Banner } from '../@ui/Banner/Banner'
import { CryptoChart } from '../@ui/Chart/CryptoChart'
import * as authService from 'services/auth'
import TableSection from 'components/TableSection/TableSection'
import { CoinMetrics } from '../@ui/Table/CoinMetrics'
import styled from '@emotion/styled'

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
        <CryptoChart wrapperStyles={{ marginTop: '16px', width: '100%' }} />

        <Grid>
          <Grid>
            <CoinMetrics title="Coin Metrics" hideHeading />
          </Grid>
          <Grid>
            <TableSection comingSoon title="Farming Metrics" subtitle="NFT 18" />
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Container = styled.div`
  max-width: 1536px;
  width: 100%;
  padding-bottom: 100px;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 8px;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    margin: 0px;
  }
`;
