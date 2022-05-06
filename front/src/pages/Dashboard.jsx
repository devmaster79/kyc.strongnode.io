import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useEthers, useEtherBalance, useTokenBalance } from '@usedapp/core'
import { ethers } from 'ethers'
import userService from '../services/userService'
import { Banner } from '../@ui/Banner/Banner'
import { CryptoChart } from '../@ui/Chart/CryptoChart'
import * as authService from 'services/auth'
import TableSection from 'components/TableSection/TableSection'
import { CoinMetrics } from '../@ui/Table/CoinMetrics'
import styled from '@emotion/styled'

const SneAddress = '0x32934CB16DA43fd661116468c1B225Fc26CF9A8c'

export default function Dashboard() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { account, chainId } = useEthers()
  const navigate = useNavigate()

  const balance = useEtherBalance(account)
  const accountBalance = balance ? ethers.utils.formatEther(balance) : 0
  const SneBalanceBigNumber = useTokenBalance(SneAddress, account)
  const SneBalance =
    SneBalanceBigNumber && ethers.utils.formatUnits(SneBalanceBigNumber, 18)

  const [availableToken, setAvailableToken] = useState(0)
  const [lockedToken, setLockedToken] = useState(0)

  const dash = useRef()
  useEffect(() => {
    // navigate('/dashboard/kyc')
    handleDashboard()
  }, [dash])

  const signOut = () => {
    authService.signOut()
    navigate('/verify-email')
  }

  const token = localStorage.getItem('token')
  const useremail = localStorage.getItem('email')
  const [user, setUser] = useState()
  const [investor, setInvestor] = useState()

  useEffect(() => {
    async function fetch() {
      const userResult = await userService.getProfile()
      const investorResult = await userService.getInvestorDetails()

      if (!userResult.data) {
        console.error('Cannot get the user object! Please, try to relogin.')
        signOut()
        return
      }

      setUser(userResult.data[0])
      setInvestor(investorResult.data)
      setAvailableToken(userResult.data[0]?.remaining_total_amount)
      setLockedToken(userResult.data[0]?.locked_bonus_amount)
    }

    fetch()
  }, [token, useremail])

  const handleDashboard = useCallback(async () => {
    if (localStorage.getItem('visit') !== 'true') {
      enqueueSnackbar('Welcome to the StrongNodeID dashboard', {
        variant: 'success'
      })
      localStorage.setItem('visit', 'true')
    }
  }, [])

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
