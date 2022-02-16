import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import styled from '@material-ui/core/styles/styled';
import Box from '@material-ui/core/Box';
import Stack from '@material-ui/core/Stack';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import sidebarConfig from './SidebarConfig';

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 130;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.complex
    })
  }
}));

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const { isCollapse, collapseClick, collapseHover, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#2a274e',
          transition: 'width 15s'
        }
      }}>
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: 80 }}>
        <Box component={RouterLink} to="/dashboard/app" sx={{ display: 'inline-flex' }}>
          <Logo sx={{ width: '65px', height: '65px', marginTop: '25px' }} />
        </Box>
      </Stack>

      <NavSection navConfig={sidebarConfig} isShow={!isCollapse} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        transition: 'width 2s',
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      }}>
      <Hidden lgUp>
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {
              borderRadius: '0px 30px 30px 0px',
              width: DRAWER_WIDTH,
              transition: 'width .2s',
              background: 'rgba(255, 255, 255, 0.1)',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                borderRight: 0,
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: '#2D405A'
              })
            }
          }}>
          {renderContent}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              borderRadius: '0px 30px 30px 0px',
              width: DRAWER_WIDTH,
              transition: 'width .2s',
              background: 'rgba(255, 255, 255, 0.1)',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH
              }),
              border: '1px solid #1DF4F6',
              backdropFilter: 'blur(3px)',
              ...(collapseHover && {
                borderRight: 0,
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: '#2D405A'
              })
            }
          }}>
          {renderContent}
        </Drawer>
      </Hidden>
    </RootStyle>
  );
}
