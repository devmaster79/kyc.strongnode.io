import * as React from 'react';
import { useSnackbar } from 'notistack5';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Stack from '@material-ui/core/Stack';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import styled from '@material-ui/core/styles/styled';
import { useState, useEffect, useCallback, useRef } from 'react';
import Status from 'components/Status';
import VestTable from 'components/dashboard/VestTable';
import WithdrawTable from 'components/dashboard/WithdrawTable';
import SvgIconStyle from 'components/SvgIconStyle';
import MyVestedTokensChart from 'components/Charts/MyVestedTokensChart';
import BonusTokensChart from 'components/Charts/BonusTokensChart';
import RecentLockupsChart from 'components/Charts/RecentLockupsChart';
import NewsCarousel from 'components/Carousels/NewsCarousel';
import useCollapseDrawer from '../hooks/useCollapseDrawer';
import { useToken, useEthers, useEtherBalance, useTokenBalance } from '@usedapp/core';
import { ethers } from 'ethers';
import WithdrawTimer from '../components/dashboard/WithdrawTimer';
import { historyAction } from '../utils/api';

const SneAddress = '0x32934CB16DA43fd661116468c1B225Fc26CF9A8c';

const CardStyle = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid #1DF4F6',
  boxSizing: 'border-box',
  backdropFilter: 'blur(3px)',
  /* Note: backdrop-filter has minimal browser support */

  borderRadius: '30px',
  padding: theme.spacing(4)
}));

const SBLinearProgress = styled(LinearProgress)`
  background-color: #b300fe !important;
  > span {
    background-color: #31f7f9 !important;
  }
`;

const SBButton = styled(Button)`
  background: #aa1fec;
  box-shadow: 4px 12px 10px rgba(0, 0, 0, 0.5);
  border-radius: 30px;
  border: none;
  font-size: 19px;
  font-family: 'Halyard-Book';
  width: 192px;
  height: 58px;
`;

const SB2Button = styled(SBButton)`
  color: #1df4f6;
  background: transparent;
  box-shadow: none;
`;
export default function Dashboard() {
  const [withdrawable, setWithdrawable] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [historyOpen, setHistoryOpen] = useState();
  const [newsOpen, setNewsOpen] = useState();
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const tokenInfo = useToken(account);
  const balance = useEtherBalance(account);
  const accountBalance = balance ? ethers.utils.formatEther(balance) : 0;
  const SneBalanceBigNumber = useTokenBalance(SneAddress, account);
  const SneBalance = SneBalanceBigNumber && ethers.utils.formatUnits(SneBalanceBigNumber, 18);

  // const [vestedTokens, setVestedTokens] = useState(0);
  const [availableToken, setAvailableToken] = useState(6);
  const [lockedToken, setLockedToken] = useState(6);
  const [withdrawTime, setWithdrawTime] = useState();

  const handleViewHistory = () => {
    setHistoryOpen(!historyOpen);
  };
  const { isCollapse } = useCollapseDrawer();
  const dash = useRef();
  let isChanged = false;
  const handleAllNews = () => {
    setNewsOpen(!newsOpen);
  };
  useEffect(() => {
    handleDashboard();
    console.log('width', dash.current ? dash.current.offsetWidth : 0);
  }, [dash]);

  const [history, setHistory] = useState();
  const [vestedprogress, setVestedProgress] = useState(0);
  const [withdrawhistory, setWithdrawHistory] = useState();
  const [withdrawprogress, setWithdrawProgress] = useState(0);
  const [totalVested, setTotalVested] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const token = localStorage.getItem('token');
  const useremail = localStorage.getItem('email');
  const [user, setUser] = useState();

  useEffect(() => {
    async function fetch() {
      const url = process.env.REACT_APP_BASE_URL + `/api/users/profile/get?email=${useremail}`;
      console.log('server url: ', url);
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(result.data[0]);
    }

    fetch();
  }, [token, useremail]);

  const withdraw = () => {
    try {
      const url = process.env.REACT_APP_BASE_URL + `/api/history/`;
      console.log('server url: ', url);

      const data = {
        user_name: user.user_name,
        token_amount: 100,
        action_type: 'withdrawn',
        date: new Date()
      };
      historyAction(url, data).then((r) => {
        if (r.status === 200) {
          enqueueSnackbar('Withdraw successfully1', {
            variant: 'success'
          });
        } else {
          enqueueSnackbar('Failed to Withdraw', { variant: 'fail' });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetch() {
      if (!refresh) return;
      const token = localStorage.getItem('token');
      // console.log(token);
      const url =
        process.env.REACT_APP_BASE_URL +
        '/api/history/findAllVested?user_name=' +
        localStorage.getItem('username');
      console.log('====================', url);
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(result);
      if (typeof history === 'string') {
        enqueueSnackbar('History data is not array!', { variant: 'error' });
      } else {
        setHistory(result.data);
        if (result.data.length > 0) {
          console.assert(result.data[0].date !== undefined, "No date provided");
          const expTime = new Date(result.data[0].date);
          expTime.setFullYear(expTime.getFullYear() + 1);
          // expTime.setSeconds(expTime.getSeconds() + 10);
          setWithdrawTime(expTime);
        }

        let min = 1000000000000;
        let sumVested = 0;
        for (let i = 0; i < result.data.length; i++) {
          sumVested += parseInt(result.data[i].token_amount);
          const temp = new Date(result.data[i].date);
          let date = new Date();
          console.log(date.getTime() - temp.getTime());
          if (min > date.getTime() - temp.getTime()) min = date.getTime() - temp.getTime();
        }
        setTotalVested(sumVested);
        setVestedProgress(Math.min(min / 1000 / 60, 100));
      }

      const token1 = localStorage.getItem('token');
      const url1 =
        process.env.REACT_APP_BASE_URL +
        '/api/history/findAllWithdrawn/?user_name=' +
        localStorage.getItem('username');
      const result1 = await axios.get(url1, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (typeof history === 'string') {
        enqueueSnackbar('History data is not array!', { variant: 'error' });
      } else {
        setWithdrawHistory(result1.data);
        let min = 1000000000000;
        let sumWithdrawn = 0;
        for (let i = 0; i < result1.data.length; i++) {
          sumWithdrawn += parseInt(result1.data[i].token_amount);
          const temp = new Date(result1.data[i].date);
          let date = new Date();
          console.log(date.getTime() - temp.getTime());
          if (min > date.getTime() - temp.getTime()) min = date.getTime() - temp.getTime();
        }
        setTotalWithdrawn(sumWithdrawn);
        console.log(min);
        setWithdrawProgress(Math.min(min / 1000 / 60, 100));
      }
      console.log(refresh);
      setRefresh(false);
    }
    fetch();
  }, [refresh]);
  const handleDashboard = useCallback(async () => {
    try {
      if (localStorage.getItem('username') && localStorage.getItem('email')) {
        if (localStorage.getItem('visit') !== 'true') {
          enqueueSnackbar('Welcome to the StrongNodeID dashboard', {
            variant: 'success'
          });
          localStorage.setItem('visit', 'true');
        }
      } else {
        enqueueSnackbar('You must sign in!', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('You must sign in!', { variant: 'error' });
      console.log('Error for getting user info', err);
    }
  }, []);
  return (
    <Container ref={dash} maxWidth="xl">
      <CardStyle
        sx={{
          height: { xs: 'max-content', md: 120 },
          width: 1,
          borderRadius: '16px',
          py: 1,
          px: '30px'
        }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
          <Box component="img" src="/images/SNE disorted edited shadow 1.png" alt="pair" />
          <Stack justifyContent="space-between" sx={{ pl: 4, py: 1 }}>
            <Typography
              color="white"
              sx={{ fontSize: 24, fontFamily: 'Halyard-Book', fontWeight: 600 }}>
              STAKE SNE ON STRONGNODE.IO
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <SBButton variant="contained" size="large">
            Earn SNE
          </SBButton>
        </Stack>
      </CardStyle>

      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <CardStyle sx={{ height: { md: '250px' } }}>
            <Typography variant="h5" color="white" fontFamily="Halyard-Book">
              MY VESTED TOKENS
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ mt: 2 }}>
                <Box>
                  <Typography color="#1DF4F6" variant="h2">
                    AVAILABLE
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="white"
                      sx={{
                        fontSize: { lg: isCollapse ? 32 : 25, md: 19 },
                        fontWeight: 700
                      }}
                      style={{ fontSize: '5bw' }}>
                      {SneBalance}
                    </Typography>
                    <Typography
                      color="white"
                      variant="h2"
                      sx={{ fontSize: 14, fontWeight: 600, ml: 1, mt: '2px' }}>
                      SNE
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography color="#AA1FEC" variant="h5" fontSize="18px">
                    LOCKED BONUS TOKENS
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="white"
                      sx={{
                        fontSize: { lg: isCollapse ? 32 : 25, md: 19 },
                        fontWeight: 700
                      }}>
                      {lockedToken}
                    </Typography>
                    <Typography
                      color="white"
                      variant="h2"
                      sx={{ fontSize: 14, fontWeight: 600, ml: 1, mt: '2px' }}>
                      SNE
                    </Typography>
                  </Stack>
                </Box>
              </Box>
              <MyVestedTokensChart chartData={[availableToken, lockedToken]} />
            </Stack>
          </CardStyle>
        </Grid>

        <Grid item xs={12} md={4}>
          <CardStyle sx={{ height: { md: '250px' } }}>
            <Typography variant="h5" color="white">
              BONUS TOKENS
            </Typography>
            <Stack sx={{}}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  mt: 2,
                  mr: 1,
                  marginLeft: { lg: isCollapse ? '0px' : '-10px', md: '0px' }
                }}>
                <Box sx={{ mr: 1 }}>
                  <Typography
                    color="#F6EE2E"
                    sx={{ fontSize: { lg: 25, md: 21 }, fontWeight: 700 }}>
                    EARNED
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="white"
                      sx={{
                        fontSize: { lg: isCollapse ? 28 : 24, md: 19 },
                        fontWeight: 700
                      }}>
                      0
                    </Typography>
                    <Typography
                      color="white"
                      sx={{
                        fontSize: isCollapse ? 25 : 22,
                        fontWeight: 600,
                        ml: 0.5,
                        mt: '2px'
                      }}>
                      SNE
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ ml: 1 }}>
                  <Typography
                    color="#FC2CF4"
                    sx={{ fontSize: { lg: 25, md: 21 }, fontWeight: 700 }}>
                    LOCKED UP
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="white"
                      sx={{
                        fontSize: { lg: isCollapse ? 28 : 24, md: 19 },
                        fontWeight: 700
                      }}>
                      0
                    </Typography>
                    <Typography
                      color="white"
                      sx={{
                        fontSize: isCollapse ? 25 : 22,
                        fontWeight: 600,
                        ml: 0.5,
                        mt: '2px'
                      }}>
                      SNE
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <BonusTokensChart sx={{ flexShrink: isCollapse ? 0 : 1 }} />
            </Stack>
          </CardStyle>
        </Grid>

        <Grid item xs={12} md={4}>
          <CardStyle sx={{ height: { md: '250px', px: 0 } }}>
            <Typography variant="h5" color="white">
              RECENT LOCKUPS
            </Typography>
            <RecentLockupsChart />
            <Stack>
              <SB2Button
                endIcon={
                  <SvgIconStyle src="/icons/arrow-right.svg" sx={{ width: 12, height: 16 }} />
                }
                sx={{ margin: 'auto' }}>
                DETAILS
              </SB2Button>
            </Stack>
          </CardStyle>
        </Grid>

        <Grid item xs={12} md={6}>
          <CardStyle>
            <Typography variant="h4" color="white">
              VESTING PROGRESS
            </Typography>

            <Stack sx={{ mt: 3 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ marginBottom: '2px' }}>
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
              <SBLinearProgress
                variant="determinate"
                color="secondary"
                sx={{ height: 8, borderRadius: '6px' }}
                value={vestedprogress}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ marginBottom: '2px', marginTop: '2px' }}>
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
              <Stack direction="row" justifyContent="space-between" sx={{ marginBottom: '2px' }}>
                <Typography color="white" sx={{ fontSize: 10 }}>
                  0%
                </Typography>
                <Typography color="white" sx={{ fontSize: 10 }}>
                  25%
                </Typography>
                <Typography color="white" sx={{ fontSize: 10 }}>
                  50%
                </Typography>
                <Typography color="white" sx={{ fontSize: 10 }}>
                  75%
                </Typography>
                <Typography color="white" sx={{ fontSize: 10 }}>
                  100%
                </Typography>
              </Stack>
            </Stack>

            <Stack>
              <Stack direction="row" spacing={5} sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center">
                  <Status color="#1DF4F6" />
                  <Typography color="white" variant="h6">
                    0 SNE Vested
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center">
                  <Status color="#AA1FEC" />
                  <Typography color="white" variant="h6">
                    0 SNE Unvested
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Divider sx={{ my: 3, background: '#1DF4F6' }} />

            <Typography variant="h4" color="white">
              VESTING PROGRESS
            </Typography>
            <VestTable history={history} setRefresh={setRefresh} />
          </CardStyle>
        </Grid>

        <Grid item xs={12} md={6}>
          <CardStyle>
            <Typography variant="h4" color="white">
              WITHDRAWALS
            </Typography>

            <Divider sx={{ my: 3, background: '#1DF4F6' }} />

            <Stack>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <Typography color="white" variant="h6">
                      VESTED TO DATA
                    </Typography>
                  </Stack>
                  <Typography color="white" variant="h6">
                    {totalVested} SNE
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <Status color="error.main" />
                    <Typography color="white" variant="h6">
                      TOTAL WITHDRAWN
                    </Typography>
                  </Stack>
                  <Typography color="white" variant="h6">
                    {totalWithdrawn} SNE
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <Status color="secondary.main" />
                    <Typography color="white" variant="h6">
                      TOTAL REMAINING
                    </Typography>
                  </Stack>
                  <Typography color="white" variant="h6">
                    {totalVested - totalWithdrawn} SNE
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Divider sx={{ my: 3, background: '#1DF4F6' }} />

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {withdrawable && (
                <SBButton variant="contained" size="large" onClick={withdraw}>
                  WITHDRAW
                </SBButton>
              )}
              {!withdrawable && (
                <SBButton variant="disabled" size="large">
                  {withdrawTime ? (
                    <WithdrawTimer
                      expiryTimestamp={withdrawTime}
                      setWithdrawable={setWithdrawable}
                    />
                  ) : (
                    'Calculating...'
                  )}
                </SBButton>
              )}

              <SB2Button
                onClick={handleViewHistory}
                sx={{ fontSize: 16, ml: 2 }}
                endIcon={
                  <SvgIconStyle
                    src="/icons/arrow-right.svg"
                    sx={{ width: 6, height: 12, background: 'primary.main' }}
                  />
                }>
                VIEW HISTORY
              </SB2Button>
            </Stack>
            {historyOpen && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h4" color="white">
                  WITHDRAWING PROGRESS.
                </Typography>

                <Stack sx={{ mt: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ marginBottom: '2px' }}>
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
                  <SBLinearProgress
                    variant="determinate"
                    color="secondary"
                    sx={{ height: 8, borderRadius: '6px' }}
                    value={withdrawprogress}
                  />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ marginBottom: '2px', marginTop: '2px' }}>
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
                    sx={{ marginBottom: '2px' }}>
                    <Typography color="white" sx={{ fontSize: 10 }}>
                      0.0
                    </Typography>
                    <Typography color="white" sx={{ fontSize: 10 }}>
                      {(availableToken + lockedToken) * 0.25}m
                    </Typography>
                    <Typography color="white" sx={{ fontSize: 10 }}>
                      {(availableToken + lockedToken) * 0.5}m
                    </Typography>
                    <Typography color="white" sx={{ fontSize: 10 }}>
                      {(availableToken + lockedToken) * 0.75}m
                    </Typography>
                    <Typography color="white" sx={{ fontSize: 10 }}>
                      {availableToken + lockedToken}m
                    </Typography>
                  </Stack>
                </Stack>

                <Stack>
                  <Stack direction="row" spacing={5} sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center">
                      <Status color="secondary.main" />
                      <Typography color="white" variant="h6">
                        0 SNE VESTED
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                      <Status color="secondary.30" />
                      <Typography color="white" variant="h6">
                        0 SNE UNVESTED
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Divider sx={{ my: 3, background: '#1DF4F6' }} />

                <Typography variant="h4" color="white">
                  WITHDRAWING PROGRESS
                </Typography>
                <WithdrawTable history={withdrawhistory} setRefresh={setRefresh} />
              </Box>
            )}
          </CardStyle>

          <CardStyle sx={{ mt: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h4" color="white">
                NEWS
              </Typography>
              <SB2Button
                sx={{ fontSize: 16, ml: 2 }}
                endIcon={
                  <SvgIconStyle
                    src="/icons/arrow-right.svg"
                    sx={{ width: 6, height: 12, background: 'primary.main' }}
                  />
                }>
                READ ALL NEWS
              </SB2Button>
            </Stack>

            <Divider sx={{ my: 2, background: '#1DF4F6' }} />

            <NewsCarousel />
          </CardStyle>

          <CardStyle sx={{ mt: 4 }}>
            <Typography variant="h4" color="white">
              INVESTMENT DETAILS
            </Typography>

            <Divider sx={{ mt: 2, mb: '12px', background: '#1DF4F6' }} />

            <Stack>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="white" variant="h6">
                    INVESTOR
                  </Typography>
                  <Typography variant="h6" color="white">
                    Pull this out from the fucking database
                  </Typography>
                </Stack>

                <Divider sx={{ my: '12px', background: '#1DF4F6' }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="white" variant="h6">
                    PURCHASE DATE
                  </Typography>
                  <Typography color="white" variant="h6">
                    Do not be static
                  </Typography>
                </Stack>

                <Divider sx={{ my: '12px', background: '#1DF4F6' }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="white" variant="h6">
                    PURCHASE ROUND
                  </Typography>
                  <Typography color="white" variant="h6">
                    Strategic
                  </Typography>
                </Stack>

                <Divider sx={{ my: '12px', background: '#1DF4F6' }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="white" variant="h6">
                    TOTAL PURCHASE
                  </Typography>
                  <Typography color="white" variant="h6">
                    0SNE
                  </Typography>
                </Stack>

                <Divider sx={{ my: '12px', background: '#1DF4F6' }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="white" variant="h6">
                    INVESTMENT AMOUNT
                  </Typography>
                  <Typography color="white" variant="h6">
                    $0
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardStyle>
        </Grid>
      </Grid>
    </Container>
  );
}
