import * as React from "react";
import { useSnackbar } from "notistack5";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Stack,
  Button,
  Grid,
  Divider,
  LinearProgress,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { useState, useEffect, useCallback, useRef } from "react";
import Status from "components/Status";
import VestTable from "components/dashboard/VestTable";
import SvgIconStyle from "components/SvgIconStyle";
import MyVestedTokensChart from "components/Charts/MyVestedTokensChart";
import BonusTokensChart from "components/Charts/BonusTokensChart";
import RecentLockupsChart from "components/Charts/RecentLockupsChart";
import NewsCarousel from "components/Carousels/NewsCarousel";
import useCollapseDrawer from "../hooks/useCollapseDrawer";

const CardStyle = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(180deg, rgba(248, 255, 255, 0.15) 0%, rgba(156, 255, 249, 0.15) 100%)",
  border: "5px solid #964CFA",
  boxSizing: "border-box",
  borderRadius: "16px",
  padding: theme.spacing(4),
}));

export default function Dashboard() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [historyOpen, setHistoryOpen] = useState();
  const [newsOpen, setNewsOpen] = useState();

  // const [vestedTokens, setVestedTokens] = useState(0);
  const [availableToken, setAvailableToken] = useState(0);
  const [lockedToken, setLockedToken] = useState(0);

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
    console.log("width", dash.current ? dash.current.offsetWidth : 0);
  }, [dash]);

  const [history, setHistory] = useState();
  useEffect(() => {
    async function fetch() {
      const token = localStorage.getItem("token");
      const url =
        process.env.REACT_APP_BASE_URL +
        "/api/history/findAllVested/?user_name=test";
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (typeof history === "string") {
        enqueueSnackbar("History data is not array!", { variant: "error" });
      } else {
        setHistory(result.data);
      }
    }
    fetch();
  }, []);

  const handleDashboard = useCallback(async () => {
    try {
      if (localStorage.getItem("username") && localStorage.getItem("email")) {
        if (localStorage.getItem("visit") !== "true") {
          enqueueSnackbar("Welcome to the StrongNodeID dashboard", {
            variant: "success",
          });
          localStorage.setItem("visit", "true");
        }
      } else {
        enqueueSnackbar("You must sign in!", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("You must sign in!", { variant: "error" });
      console.log("Error for getting user info", err);
    }
  }, []);
  return (
    <Container ref={dash} maxWidth="xl">
      <Box
        sx={{
          height: { xs: "max-content", md: 120 },
          width: 1,
          background: "linear-gradient(180deg, #7C1EFB 0%, #AF56B8 98.44%)",
          borderRadius: "16px",
          py: 1.5,
          px: "30px",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} alignItems="center">
          <Box component="img" src="/images/logo.png" alt="pair" />
          <Stack justifyContent="space-between" sx={{ pl: 4, py: 1 }}>
            <Typography color="white" sx={{ fontSize: 20 }}>
              Stake SNE on StrongNode
            </Typography>
            <Typography color="white" sx={{ fontSize: 12 }}>
              Stake your SNE on StrongNode, COMING SOON!
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" size="large">
            Earn SNE
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <CardStyle sx={{ height: { md: "275px" } }}>
            <Typography variant="h5" color="text.primary">
              My Vested Tokens
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ mt: 2 }}>
                <Box>
                  <Typography color="error" variant="h2">
                    Available
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="text.primary"
                      sx={{
                        fontSize: { lg: isCollapse ? 32 : 25, md: 19 },
                        fontWeight: 700,
                      }}
                      style={{ fontSize: "5bw" }}
                    >
                      {availableToken}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="h2"
                      sx={{ fontSize: 14, fontWeight: 600, ml: 1, mt: "2px" }}
                    >
                      SNE
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography color="primary" variant="h5">
                    Locked Bonus Tokens
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="text.primary"
                      sx={{
                        fontSize: { lg: isCollapse ? 32 : 25, md: 19 },
                        fontWeight: 700,
                      }}
                    >
                      {lockedToken}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="h2"
                      sx={{ fontSize: 14, fontWeight: 600, ml: 1, mt: "2px" }}
                    >
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
          <CardStyle sx={{ height: { md: "275px" } }}>
            <Typography variant="h5" color="text.primary">
              Bonus Tokens
            </Typography>
            <Stack sx={{}}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  mt: 2,
                  mr: 1,
                  marginLeft: { lg: isCollapse ? "0px" : "-10px", md: "0px" },
                }}
              >
                <Box sx={{ mr: 1 }}>
                  <Typography
                    color="warning.main"
                    sx={{ fontSize: { lg: 25, md: 21 }, fontWeight: 700 }}
                  >
                    Earned
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="text.primary"
                      sx={{
                        fontSize: { lg: isCollapse ? 28 : 24, md: 19 },
                        fontWeight: 700,
                      }}
                    >
                      0
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: isCollapse ? 25 : 22,
                        fontWeight: 600,
                        ml: 0.5,
                        mt: "2px",
                      }}
                    >
                      SNE
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ ml: 1 }}>
                  <Typography
                    color="primary"
                    sx={{ fontSize: { lg: 25, md: 21 }, fontWeight: 700 }}
                  >
                    Locked Up
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      color="text.primary"
                      sx={{
                        fontSize: { lg: isCollapse ? 28 : 24, md: 19 },
                        fontWeight: 700,
                      }}
                    >
                      0
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: isCollapse ? 25 : 22,
                        fontWeight: 600,
                        ml: 0.5,
                        mt: "2px",
                      }}
                    >
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
          <CardStyle sx={{ height: { md: "275px", px: 0 } }}>
            <Typography
              variant="h5"
              sx={{ textAlign: "center" }}
              color="text.primary"
            >
              Recent Lockups
            </Typography>
            <RecentLockupsChart />
            <Stack>
              <Button
                endIcon={
                  <SvgIconStyle
                    src="/icons/arrow-right.svg"
                    sx={{ width: 12, height: 16 }}
                  />
                }
                sx={{ margin: "auto" }}
              >
                Details
              </Button>
            </Stack>
          </CardStyle>
        </Grid>

        <Grid item xs={12} md={6}>
          <CardStyle>
            <Typography variant="h4" color="text.primary">
              Vesting Progress.
            </Typography>

            <Stack sx={{ mt: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ marginBottom: "2px" }}
              >
                <Divider
                  orientation="vertical"
                  sx={{ height: 5, borderRight: "2px solid #C0C6CE" }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 5, borderRight: "2px solid #C0C6CE" }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 5, borderRight: "2px solid #C0C6CE" }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 5, borderRight: "2px solid #C0C6CE" }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 5, borderRight: "2px solid #C0C6CE" }}
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={0}
                color="secondary"
                sx={{ height: 8, borderRadius: "6px" }}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ marginBottom: "2px", marginTop: "2px" }}
              >
                <Divider
                  orientation="vertical"
                  sx={{ height: 8, borderRight: "2px solid #C0C6CE" }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 8, borderRight: "2px solid #C0C6CE" }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 8, borderRight: "2px solid #C0C6CE" }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 8, borderRight: "2px solid #C0C6CE" }}
                />
                <Divider
                  orientation="vertical"
                  sx={{ height: 8, borderRight: "2px solid #C0C6CE" }}
                />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ marginBottom: "2px" }}
              >
                <Typography color="typography.50" sx={{ fontSize: 10 }}>
                  0.0
                </Typography>
                <Typography color="typography.50" sx={{ fontSize: 10 }}>
                {(availableToken + lockedToken)*0.25}m
                </Typography>
                <Typography color="typography.50" sx={{ fontSize: 10 }}>
                {(availableToken + lockedToken)*0.5}m
                </Typography>
                <Typography color="typography.50" sx={{ fontSize: 10 }}>
                {(availableToken + lockedToken)*0.75}m
                </Typography>
                <Typography color="typography.50" sx={{ fontSize: 10 }}>
                  {availableToken + lockedToken}m
                </Typography>
              </Stack>
            </Stack>

            <Stack>
              <Stack direction="row" spacing={5} sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center">
                  <Status color="secondary.main" />
                  <Typography color="text.secondary" variant="h6">
                    0 SNE vested
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center">
                  <Status color="secondary.30" />
                  <Typography color="text.secondary" variant="h6">
                    0 SNE unvested
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h4" color="text.primary">
              Vesting Progress
            </Typography>
            <VestTable history={history} />
          </CardStyle>
        </Grid>

        <Grid item xs={12} md={6}>
          <CardStyle>
            <Typography variant="h4" color="text.primary">
              Withdrawals
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Stack>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <Typography color="text.secondary" variant="h6">
                      Vested to data
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" variant="h6">
                    0 SNE
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <Status color="error.main" />
                    <Typography color="text.secondary" variant="h6">
                      Total Withdrawn
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" variant="h6">
                    0 SNE
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <Status color="secondary.main" />
                    <Typography color="text.secondary" variant="h6">
                      Total Remaining
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" variant="h6">
                    0 SNE
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
                sx={{ fontSize: 16, color: "primary.main", ml: 2 }}
                endIcon={
                  <SvgIconStyle
                    src="/icons/arrow-right.svg"
                    sx={{ width: 6, height: 12, background: "primary.main" }}
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
              <Typography variant="h4" color="text.primary">
                News
              </Typography>
              <Button
                sx={{ fontSize: 16, color: "primary.main", ml: 2 }}
                endIcon={
                  <SvgIconStyle
                    src="/icons/arrow-right.svg"
                    sx={{ width: 6, height: 12, background: "primary.main" }}
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
            <Typography variant="h4" color="text.primary">
              Investment Details
            </Typography>

            <Divider sx={{ mt: 2, mb: "12px" }} />

            <Stack>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary" variant="h6">
                    Investor
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    Pull this out from the fucking database
                  </Typography>
                </Stack>

                <Divider sx={{ my: "12px" }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary" variant="h6">
                    Purchase Date
                  </Typography>
                  <Typography color="text.secondary" variant="h6">
                    Do not be static
                  </Typography>
                </Stack>

                <Divider sx={{ my: "12px" }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary" variant="h6">
                    Purchase Round
                  </Typography>
                  <Typography color="text.secondary" variant="h6">
                    Strategic
                  </Typography>
                </Stack>

                <Divider sx={{ my: "12px" }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary" variant="h6">
                    Total Purchase
                  </Typography>
                  <Typography color="text.secondary" variant="h6">
                    0SNE
                  </Typography>
                </Stack>

                <Divider sx={{ my: "12px" }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary" variant="h6">
                    Investment Amount
                  </Typography>
                  <Typography color="text.secondary" variant="h6">
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
