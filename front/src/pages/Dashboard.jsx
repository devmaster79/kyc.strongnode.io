import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useEthers, useEtherBalance, useTokenBalance } from '@usedapp/core'
import { ethers } from 'ethers'
import userService from '../services/userService'
import { Banner } from '../@ui/Banner/Banner'
import { CryptoChart } from '../@ui/Chart/CryptoChart'
import * as authService from 'services/auth'
import TableSection from 'components/TableSection/TableSection'
import { CoinMetrics } from '../@ui/Table/CoinMetrics'

const SneAddress = '0x32934CB16DA43fd661116468c1B225Fc26CF9A8c'

export default function Dashboard () {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { account, chainId } = useEthers()
  console.log('this is the chain')
  console.log(chainId)
  const navigate = useNavigate()

  const balance = useEtherBalance(account)
  const accountBalance = balance ? ethers.utils.formatEther(balance) : 0
  console.log('this is the ballance')
  console.log(accountBalance)
  const SneBalanceBigNumber = useTokenBalance(SneAddress, account)
  const SneBalance = SneBalanceBigNumber && ethers.utils.formatUnits(SneBalanceBigNumber, 18)

  const [availableToken, setAvailableToken] = useState(0)
  const [lockedToken, setLockedToken] = useState(0)

  const dash = useRef()
  useEffect(() => {
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
    async function fetch () {
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
    <Container ref={dash} maxWidth='xl' style={{ paddingBottom: 100 }}>
      <Banner title='StrongNode dVPN coming soon.' description='Stay tuned for more information.' />
      <h1 style={{ marginTop: '56px' }}>DeFi Dashboard</h1>
      <CryptoChart wrapperStyles={{ marginTop: '16px' }} />

      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={6}>
          <CoinMetrics title='Coin Metrics' hideHeading />
        </Grid>
        <Grid item xs={6}>
          <TableSection comingSoon title='Farming Metrics' subtitle='NFT 18' />
        </Grid>
      </Grid>
    </Container>
  )
}
