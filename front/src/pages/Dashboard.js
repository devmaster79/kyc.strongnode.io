import { merge } from 'lodash'
import { useSnackbar } from 'notistack5'
import {
  Container,
  Typography,
  Box,
  Stack,
  Button,
  Grid,
  Divider,
  Table,
  LinearProgress,
} from '@material-ui/core'
import { styled } from '@material-ui/core/styles'
import { useEffect, useState } from 'react'
import axios from 'utils/axios'
import Status from 'components/Status'
import VestTable from 'components/dashboard/VestTable'
import SvgIconStyle from 'components/SvgIconStyle'
import MyVestedTokensChart from 'components/Charts/MyVestedTokensChart'
import BonusTokensChart from 'components/Charts/BonusTokensChart'
import RecentLockupsChart from 'components/Charts/RecentLockupsChart'
import NewsCarousel from 'components/Carousels/NewsCarousel'

const CardStyle = styled(Box)(({ theme }) => ({
  background:
    'linear-gradient(180deg, rgba(248, 255, 255, 0.15) 0%, rgba(156, 255, 249, 0.15) 100%)',
  border: '5px solid #964CFA',
  boxSizing: 'border-box',
  borderRadius: '16px',
  padding: theme.spacing(4),
}))

export default function Dashboard() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [historyOpen, setHistoryOpen] = useState()
  const [newsOpen, setNewsOpen] = useState()
  const handleViewHistory = () => {
    setHistoryOpen(!historyOpen)
  }

  const handleAllNews = () => {
    setNewsOpen(!newsOpen)
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) enqueueSnackbar('You must sign in!', { variant: 'error' })
    else enqueueSnackbar('Welcome to dashboard', { variant: 'success' })
  })
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          height: 120,
          width: 1,
          background: 'linear-gradient(180deg, #7C1EFB 0%, #AF56B8 98.44%)',
          borderRadius: '16px',
          py: 3,
          px: '30px',
        }}
      >
        <Stack direction="row" alignItems="center">
          <Box component="img" src="/images/pair.png" alt="pair" />
          <Stack justifyContent="space-between" sx={{ pl: 4, py: 1 }}>
            <Typography color="white" sx={{ fontSize: 20 }}>
              Stake OGN on ousd.com
            </Typography>
            <Typography color="white" sx={{ fontSize: 12 }}>
              As part of the Origin Dolllar governance project, OGN staking has
              moved to ousd.com
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" size="large">
            Earn OGN
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <CardStyle>
            <Typography variant="h5">My Vested Tokens</Typography>
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ mt: 2 }}>
                <Box>
                  <Typography color="error" variant="h2">
                    Avaiable
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="black"
                      sx={{ fontSize: 32, fontWeight: 700 }}
                    >
                      158,357
                    </Typography>
                    <Typography
                      color="typography.70"
                      variant="h2"
                      sx={{ fontSize: 14, fontWeight: 600, ml: 1, mt: '2px' }}
                    >
                      OGN
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography color="primary" variant="h5">
                    Locked Bonus Tokens
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="black"
                      sx={{ fontSize: 32, fontWeight: 700 }}
                    >
                      100,000
                    </Typography>
                    <Typography
                      color="typography.70"
                      variant="h2"
                      sx={{ fontSize: 14, fontWeight: 600, ml: 1, mt: '2px' }}
                    >
                      OGN
                    </Typography>
                  </Stack>
                </Box>
              </Box>
              <MyVestedTokensChart />
            </Stack>
          </CardStyle>
        </Grid>

        <Grid item xs={12} md={4}>
          <CardStyle>
            <Typography variant="h5">Bonus Tokens</Typography>
            <Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 2, mr: 1 }}
              >
                <Box>
                  <Typography color="warning.main" variant="h2">
                    Earned
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="black"
                      sx={{ fontSize: 32, fontWeight: 700 }}
                    >
                      158,357
                    </Typography>
                    <Typography
                      color="typography.70"
                      variant="h2"
                      sx={{ fontSize: 14, fontWeight: 600, ml: 1, mt: '2px' }}
                    >
                      OGN
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  <Typography color="primary" variant="h2">
                    Locked Up
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="black"
                      sx={{ fontSize: 32, fontWeight: 700 }}
                    >
                      100,000
                    </Typography>
                    <Typography
                      color="typography.70"
                      variant="h2"
                      sx={{ fontSize: 14, fontWeight: 600, ml: 1, mt: '2px' }}
                    >
                      OGN
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <BonusTokensChart />
            </Stack>
          </CardStyle>
        </Grid>

        <Grid item xs={12} md={4}>
          <CardStyle>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              Recent Lockups
            </Typography>
            <RecentLockupsChart />
            <Stack>
              <Button
                endIcon={
                  <SvgIconStyle
                    src="/icons/arrow-right.svg"
                    sx={{ width: 6, height: 12 }}
                  />
                }
                sx={{ margin: 'auto' }}
              >
                Details
              </Button>
            </Stack>
          </CardStyle>
        </Grid>

        <Grid item xs={12} md={6}>
          <CardStyle>
            <Typography variant="h4">Vesting Progress</Typography>

            <Stack sx={{ mt: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ marginBottom: '2px' }}
              >
                <Divider
                  orientation="vertical"
                  sx={{ height: 5, borderRight: '2px solid #C0C6CE' }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 5, borderRight: '2px solid #C0C6CE' }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 5, borderRight: '2px solid #C0C6CE' }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 5, borderRight: '2px solid #C0C6CE' }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 5, borderRight: '2px solid #C0C6CE' }}
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={70}
                color="secondary"
                sx={{ height: 8, borderRadius: '6px' }}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ marginBottom: '2px', marginTop: '2px' }}
              >
                <Divider
                  orientation="vertical"
                  sx={{ height: 8, borderRight: '2px solid #C0C6CE' }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 8, borderRight: '2px solid #C0C6CE' }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 8, borderRight: '2px solid #C0C6CE' }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 8, borderRight: '2px solid #C0C6CE' }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 8, borderRight: '2px solid #C0C6CE' }}
                />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ marginBottom: '2px' }}
              >
                <Typography color="typography.50" sx={{ fontSize: 10 }}>
                  0.0
                </Typography>
                <Typography color="typography.50" sx={{ fontSize: 10 }}>
                  705.8k
                </Typography>
                <Typography color="typography.50" sx={{ fontSize: 10 }}>
                  1.4m
                </Typography>
                <Typography color="typography.50" sx={{ fontSize: 10 }}>
                  2.1m
                </Typography>
                <Typography color="typography.50" sx={{ fontSize: 10 }}>
                  2.8m
                </Typography>
              </Stack>
            </Stack>

            <Stack>
              <Stack direction="row" spacing={5} sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center">
                  <Status color="secondary.main" />
                  <Typography color="typography.75" variant="h6">
                    2,159,872 OGN vested
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center">
                  <Status color="secondary.30" />
                  <Typography color="typography.75" variant="h6">
                    663,495 OGN unvested
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h4">Vesting Progress</Typography>
            <VestTable />
          </CardStyle>
        </Grid>

        <Grid item xs={12} md={6}>
          <CardStyle>
            <Typography variant="h4">Withdrawals</Typography>

            <Divider sx={{ my: 3 }} />

            <Stack>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <Typography color="typography.75" variant="h6">
                      Vested to data
                    </Typography>
                  </Stack>
                  <Typography color="typography.75" variant="h6">
                    169,402 OGN
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <Status color="error.main" />
                    <Typography color="typography.75" variant="h6">
                      Total Withdrawn
                    </Typography>
                  </Stack>
                  <Typography color="typography.75" variant="h6">
                    169,402 OGN
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <Status color="secondary.main" />
                    <Typography color="typography.75" variant="h6">
                      Total Remaining
                    </Typography>
                  </Stack>
                  <Typography color="typography.75" variant="h6">
                    169,402 OGN
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" alignItems="center">
              <Button variant="contained" size="large">
                Withdraw
              </Button>
              <Button
                onClick={handleViewHistory}
                sx={{ fontSize: 16, color: 'primary.main', ml: 2 }}
                endIcon={
                  <SvgIconStyle
                    src="/icons/arrow-right.svg"
                    sx={{ width: 6, height: 12, background: 'primary.main' }}
                  />
                }
              >
                View History
              </Button>
            </Stack>
            {historyOpen && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h4">Vesting Progress</Typography>
                <VestTable />
              </Box>
            )}
          </CardStyle>

          <CardStyle sx={{ mt: 4 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h4">News</Typography>
              <Button
                sx={{ fontSize: 16, color: 'primary.main', ml: 2 }}
                endIcon={
                  <SvgIconStyle
                    src="/icons/arrow-right.svg"
                    sx={{ width: 6, height: 12, background: 'primary.main' }}
                  />
                }
              >
                Read All News
              </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <NewsCarousel />
          </CardStyle>

          <CardStyle sx={{ mt: 4 }}>
            <Typography variant="h4">Investment Details</Typography>

            <Divider sx={{ mt: 2, mb: '12px' }} />

            <Stack>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="typography.75" variant="h6">
                    Investor
                  </Typography>
                  <Typography variant="h6">RedRobot K.K.</Typography>
                </Stack>

                <Divider sx={{ my: '12px' }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="typography.75" variant="h6">
                    Purchase Date
                  </Typography>
                  <Typography color="typography.75" variant="h6">
                    Feburary 14, 2021
                  </Typography>
                </Stack>

                <Divider sx={{ my: '12px' }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="typography.75" variant="h6">
                    Purchase Round
                  </Typography>
                  <Typography color="typography.75" variant="h6">
                    Strategic
                  </Typography>
                </Stack>

                <Divider sx={{ my: '12px' }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="typography.75" variant="h6">
                    Total Purchase
                  </Typography>
                  <Typography color="typography.75" variant="h6">
                    2,823,367,OGN
                  </Typography>
                </Stack>

                <Divider sx={{ my: '12px' }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="typography.75" variant="h6">
                    Investment Amount
                  </Typography>
                  <Typography color="typography.75" variant="h6">
                    $338,8003
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardStyle>
        </Grid>
      </Grid>
    </Container>
  )
}
