import styled from '@mui/material/styles/styled';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
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

  const contactSupport = () => {
    navigate('/dashboard/contact-support');
  };

  const userProfile = () => {
    navigate('/dashboard/profile');
  };

  return (
    <RootStyle>
      <ToolbarStyle>
        <ThemeSwitch />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Typography
            onClick={userProfile}
            color="white"
            sx={{ fontSize: { xs: 10, md: 14 }, cursor: 'pointer' }}>
            {email}
          </Typography>
          <Typography color="white" sx={{ fontSize: { xs: 10, md: 14 } }}>
            |
          </Typography>
          <Typography
            onClick={contactSupport}
            color="white"
            sx={{ fontSize: { xs: 10, md: 14 }, cursor: 'pointer' }}>
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
