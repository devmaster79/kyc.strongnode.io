import styled from '@material-ui/core/styles/styled';
import Stack from '@material-ui/core/Stack';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useNavigate } from 'react-router-dom';
import ThemeSwitch from 'components/ThemeSwitch';
import * as authService from 'services/auth';

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 74;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  position: 'absolute',
  top: 'unset',
  bottom: '0',
  marginTop: 40,
  borderTopLeftRadius: '16px',
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid #1DF4F6',
  boxSizing: 'border-box',
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.up('lg')]: {
    width: '100%'
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const signOut = () => {
    authService.signOut();
    navigate('/verify-email');
  };
  return (
    <RootStyle>
      <ToolbarStyle>
        <ThemeSwitch />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Typography color="white" sx={{ fontSize: { xs: 10, md: 14 } }}>
            {email}
          </Typography>
          <Typography color="white" sx={{ fontSize: { xs: 10, md: 14 } }}>
            |
          </Typography>
          <Typography color="white" sx={{ fontSize: { xs: 10, md: 14 } }}>
            Contact Support
          </Typography>
          <Typography color="white" sx={{ fontSize: { xs: 10, md: 14 } }}>
            |
          </Typography>
          <Typography
            onClick={signOut}
            color="white"
            sx={{ cursor: 'pointer', fontSize: { xs: 10, md: 14 } }}>
            Logout
          </Typography>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
