import { useEffect } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { alpha, styled } from '@material-ui/core/styles'
import { Box, Stack, Drawer, Hidden } from '@material-ui/core'
import useCollapseDrawer from '../../hooks/useCollapseDrawer'
import Logo from '../../components/Logo'
import Scrollbar from '../../components/Scrollbar'
import NavSection from '../../components/NavSection'
import sidebarConfig from './SidebarConfig'

const DRAWER_WIDTH = 280
const COLLAPSE_WIDTH = 130

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.complex,
    }),
  },
}))

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation()

  const {
    isCollapse,
    collapseClick,
    collapseHover,
    onHoverEnter,
    onHoverLeave,
  } = useCollapseDrawer()

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ height: 80 }}
      >
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
          <Logo />
        </Box>
      </Stack>

      <NavSection navConfig={sidebarConfig} isShow={!isCollapse} />
    </Scrollbar>
  )

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      <Hidden lgUp>
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {
              borderRadius: '0px 30px 30px 0px',
              width: DRAWER_WIDTH,
              background:
                'linear-gradient(180deg, #7C1EFB 0%, #AF56B8 30.21%, #7C1EFB 64.06%, #AF56B8 100%)',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                borderRight: 0,
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: '#2D405A',
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          open
          variant="persistent"
          // onMouseEnter={onHoverEnter}
          // onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              borderRadius: '0px 30px 30px 0px',
              width: DRAWER_WIDTH,
              background:
                'linear-gradient(180deg, #7C1EFB 0%, #AF56B8 30.21%, #7C1EFB 64.06%, #AF56B8 100%)',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                borderRight: 0,
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: '#2D405A',
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      </Hidden>
    </RootStyle>
  )
}
