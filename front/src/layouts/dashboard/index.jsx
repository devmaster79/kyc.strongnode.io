import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import useCollapseDrawer from '../../hooks/useCollapseDrawer'
import Sidebar from './Sidebar'
import { Navbar } from './Navbar'
import styled from '@emotion/styled'

const RootStyle = styled.div((props) => ({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  background: props.theme.palette.background.gradient,
  backgroundSize: '100% 100%'
}))

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  marginLeft: 'auto',
  maxWidth: 'calc(100% - 104px - ' + theme.spacing(2) + ')',
  paddingTop: 32,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('lg')]: {
    paddingTop: 32
  }
}))

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme()
  const { collapseClick } = useCollapseDrawer()
  const [open, setOpen] = useState(false)

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
      </MainStyle>
    </RootStyle>
  )
}
