import SvgIconStyle from 'components/SvgIconStyle'
import { alpha, styled } from '@material-ui/core/styles'
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Hidden
} from '@material-ui/core'
import useCollapseDrawer from '../../hooks/useCollapseDrawer'
import AccountPopover from './AccountPopover'

const DRAWER_WIDTH = 280
const COLLAPSE_WIDTH = 130

const APPBAR_MOBILE = 64
const APPBAR_DESKTOP = 80

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backgroundColor: '#F3F5F9',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.03)',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH}px + 30px)`,
  },
}))

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    paddingLeft: theme.spacing(9),
    paddingRight: theme.spacing(5),
  },
}))

export default function DashboardNavbar({ onOpenSidebar }) {
  const { isCollapse, onToggleCollapse } = useCollapseDrawer()
  return (
    <RootStyle
      sx={{
        ...(isCollapse && {
          width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px + 30px)` },
        }),
      }}
    >
      <ToolbarStyle>
        {/* <Hidden width="lgUp">
          <IconButton
            onClick={onOpenSidebar}
            sx={{ mr: 1, color: 'text.primary' }}
          >
            <SvgIconStyle
              src="/icons/hamburger.svg"
              sx={{ width: '100%', height: '100%' }}
            />
          </IconButton>
        </Hidden> */}
        <IconButton onClick={onToggleCollapse}>
          <SvgIconStyle
            src="/icons/hamburger.svg"
            color="action"
            sx={{ width: 22, height: 22 }}
          />
        </IconButton>
        <Typography color="black" variant="body2" sx={{ml: 4}}>
          Check out the latest OGN token metrics 300+ investors have locked up
          20m+ tokens
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
          <IconButton>
            <Badge badgeContent={3} color="error">
              <SvgIconStyle src="/icons/bell.svg" sx={{width: 20, height: 24}} />
            </Badge>
          </IconButton>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}
