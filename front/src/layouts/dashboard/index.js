import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import DashboardNavbar from './DashboardNavbar';
import Sidebar from './Sidebar';
import DashboardFooter from './DashboardFooter';
import Navbar from './Navbar';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  backgroundSize: '100% 100%'
}));

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: 32,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('lg')]: {
    paddingTop: 32
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme();
  const { collapseClick } = useCollapseDrawer();
  const [open, setOpen] = useState(false);

  return (
    <RootStyle>
      <Navbar />
      <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle
        style={{ minHeight: '100vh', position: 'relative' }}
        sx={{
          transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.complex
          }),
          ...(collapseClick && {
            ml: '130px'
          })
        }}>
        <Outlet />
        <DashboardFooter />
      </MainStyle>
    </RootStyle>
  );
}
