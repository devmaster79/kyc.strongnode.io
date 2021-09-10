import SvgIconStyle from 'components/SvgIconStyle'
import { styled } from '@material-ui/core/styles'
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Divider
} from '@material-ui/core'
import useCollapseDrawer from '../../hooks/useCollapseDrawer'
import AccountPopover from './AccountPopover'

import ThemeSwitch from 'components/ThemeSwitch'

const DRAWER_WIDTH = 280
const COLLAPSE_WIDTH = 130

const APPBAR_MOBILE = 64
const APPBAR_DESKTOP = 74

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  position: 'relative',
  marginTop: 40,
  borderTopLeftRadius: '16px',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('lg')]: {
    width: '100%',
  },
}))

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}))

export default function DashboardNavbar({ onOpenSidebar }) {
  const { isCollapse, onToggleCollapse } = useCollapseDrawer()
  return (
    <RootStyle>
      <ToolbarStyle>
        <ThemeSwitch />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
          <Typography color="typography.75" sx={{ fontSize: 14 }}>
            daniel@redrobot.jp
          </Typography>
          <Typography color="typography.75" sx={{ fontSize: 14 }}>
            |
          </Typography>
          <Typography color="typography.75" sx={{ fontSize: 14 }}>
            Contact Support
          </Typography>
          <Typography color="typography.75" sx={{ fontSize: 14 }}>
            |
          </Typography>
          <Typography color="typography.75" sx={{ fontSize: 14 }}>
            Logout
          </Typography>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}
