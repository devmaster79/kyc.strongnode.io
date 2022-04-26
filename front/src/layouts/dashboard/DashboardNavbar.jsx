import SvgIconStyle from 'components/SvgIconStyle';
import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Hidden from '@mui/material/Hidden';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import AccountPopover from '../../pages/Dashboard/AccountPopover/AccountPopover';
import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';

import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 130;

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 80;

const RootStyle = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#15123D',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.03)',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH}px + 30px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    paddingLeft: theme.spacing(9),
    paddingRight: theme.spacing(5)
  }
}));

export default function DashboardNavbar({ onOpenSidebar }) {
  const { isCollapse, onToggleCollapse } = useCollapseDrawer();
  const [open, setOpen] = useState([false, false]);

  useEffect(() => {}, []);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    let tmp = [...open];
    tmp[0] = false;
    setOpen(tmp);
  };
  const handleSmsClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    let tmp = [...open];
    tmp[1] = false;
    setOpen(tmp);
  };
  const showNotification = () => {
    let tmp = [...open];
    tmp[0] = true;
    tmp[1] = true;
    setOpen(tmp);
  };
  const action = (
    <Box>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
  const smsAction = (
    <Box>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleSmsClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
  return (
    <RootStyle
      sx={{
        ...(isCollapse && {
          width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px + 30px)` },
          transition: { lg: 'width .2s' }
        })
      }}
    >
      <Box>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open[0]}
          autoHideDuration={6000}
          //onClose={handleClose}
          message="Please complete your KYC registration"
          action={action}
        >
          <MuiAlert
            variant="filled"
            elevation={6}
            onClose={handleClose}
            severity="warning"
            sx={{ width: '100%' }}
          >
            Please complete your KYC registration
          </MuiAlert>
        </Snackbar>
      </Box>
      <Box>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open[1]}
          autoHideDuration={6000}
          //onClose={handleClose}
          message="Please complete your SMS registration"
          action={smsAction}
          sx={{ marginTop: open[0] ? '60px' : '10px' }}
        >
          <MuiAlert
            variant="filled"
            elevation={6}
            onClose={handleSmsClose}
            severity="warning"
            sx={{ width: '100%' }}
          >
            Please complete your SMS registration
          </MuiAlert>
        </Snackbar>
      </Box>
      <ToolbarStyle>
        <Hidden lgUp>
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <SvgIconStyle
              src="/icons/hamburger.svg"
              color="action"
              sx={{ width: 22, height: 22 }}
            />
          </IconButton>
        </Hidden>
        <Hidden lgDown>
          <IconButton onClick={onToggleCollapse}>
            <SvgIconStyle
              src="/icons/hamburger.svg"
              color="action"
              sx={{ width: 22, height: 22 }}
            />
          </IconButton>
        </Hidden>
        <Typography
          variant="body2"
          sx={{ ml: 4, display: { xs: 'none', md: 'block' } }}
          color="rgba(255,255,255,0.5)"
          fontFamily="Halyard-Book"
        >
          Check out the latest SNE token metrics 300+ investors have locked up 20m+ tokens
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <IconButton onClick={showNotification}>
            <Badge badgeContent={open.filter((e) => e === false).length} color="error">
              <SvgIconStyle src="/icons/bell.svg" sx={{ width: 20, height: 24 }} />
            </Badge>
          </IconButton>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
