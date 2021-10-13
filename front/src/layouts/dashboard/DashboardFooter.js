import { useState, useEffect, useCallback } from 'react'
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
import { useNavigate } from "react-router-dom";
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
  background: 'linear-gradient(90deg, #7C1EFB 0%, #AF56B8 30.21%, #7C1EFB 64.06%, #AF56B8 100%)',
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
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  useEffect(()=>{
    setEmail(localStorage.getItem("email"))
  })
  const signOut = () => {
    window.localStorage.clear();
    navigate("/signin");
  }
  return (
    <RootStyle>
      <ToolbarStyle>
        <ThemeSwitch />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
          <Typography color="white" sx={{ fontSize:{xs:10,md:14} }}>
            {email}
          </Typography>
          <Typography color="white" sx={{ fontSize:{xs:10,md:14} }}>
            |
          </Typography>
          <Typography color="white" sx={{ fontSize:{xs:10,md:14} }}>
            Contact Support
          </Typography>
          <Typography color="white" sx={{ fontSize:{xs:10,md:14} }}>
            |
          </Typography>
          <Typography onClick={signOut} color="white" sx={{cursor:'pointer', fontSize:{xs:10,md:14} }}>
            Logout
          </Typography>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}
