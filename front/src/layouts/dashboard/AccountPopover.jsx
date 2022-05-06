import { useState, useEffect, useCallback } from 'react'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import SvgIconStyle from 'components/SvgIconStyle'
import ConnectButton, { SneBalance } from 'components/ConnectButton'
import * as React from 'react'
import Popover from '@mui/material/Popover'
import Divider from '@mui/material/Divider'
import Button from '../../@ui/Button/Button'
import styled from '@mui/material/styles/styled'
import { useNavigate } from 'react-router-dom'
import userService from 'services/userService'
import * as authService from 'services/auth'

const MyPopover = styled(Popover)`
  > div {
    border-radius: 30px !important;
  }
`
export default function AccountPopover() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    handleDashboard()
  }, [handleDashboard])

  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleDashboard = useCallback(async () => {
    try {
      if (localStorage.getItem('username') && localStorage.getItem('email')) {
        setUserName(localStorage.getItem('username'))
        setEmail(localStorage.getItem('email'))

        userService
          .getProfile()
          .then((r) => {
            setAvatar(r.data[0].profile_img_url)
          })
          .catch(() => {
            // Do nothing
          })
      }
    } catch (err) {
      console.error('Error for email verification', err)
    }
  }, [])
  const signOut = () => {
    authService.signOut()
    navigate('/verify-email')
  }
  const toProfile = () => {
    navigate('/dashboard/profile')
  }
  const toPasswordChange = () => {
    navigate('/dashboard/change-password')
  }

  return (
    <>
      <Stack
        direction="row"
        sx={{
          mr: { xs: 2, md: 0 },
          height: 54,
          width: { xs: 190, md: 270 },
          background:
            'linear-gradient(180deg, #d969ff 0%, #AD1DED 99.99%, rgba(170, 31, 236, 0) 100%)',
          filter: 'drop-shadow(4px 12px 10px rgba(0, 0, 0, 0.5))',
          borderRadius: '30px',
          pl: 1,
          pr: 2
        }}
        alignItems="center"
        onClick={handleClick}
        justifyContent="space-between">
        <Avatar src={avatar} alt="avatar" />

        <Stack sx={{ color: 'black', ml: 2, mr: 2 }}>
          <Typography
            color="white"
            sx={{ fontSize: { md: 18, xs: 12 }, textAlign: 'center' }}>
            {userName}
          </Typography>
          <Typography
            color="white"
            sx={{ fontSize: { md: 12, xs: 8 }, textAlign: 'center' }}>
            {email}
          </Typography>
        </Stack>
        <SvgIconStyle
          src="/icons/arrow-down.svg"
          sx={{ width: '16px', height: '8px', backgroundColor: 'black' }}
        />
      </Stack>
      <MyPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        sx={{
          top: { xs: '-2vh', md: -12, lg: -3 }
        }}>
        <Stack
          sx={{
            height: 320,
            width: { md: 270, xs: 190 },
            border: '2px solid rgba(238, 238, 238, 0.5)',
            background: 'linear-gradient(180deg, #7C1EFB 0%, #AF56BB 100%)',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '30px',
            pl: 1,
            pr: 1
          }}>
          <Stack alignItems="center">
            <Avatar sx={{ mt: 2 }} src={avatar} alt="avatar" />
            <Typography color="white" sx={{ fontSize: 18 }}>
              {userName}
            </Typography>
            <Typography color="white" sx={{ fontSize: 15 }}>
              {email}
            </Typography>
            <Divider light color="white" sx={{ width: 200 }} />
          </Stack>
          <ConnectButton />
          <Typography color="white" sx={{ fontSize: 18, ml: 3, mt: 1 }}>
            SNE Balance: {SneBalance()}
          </Typography>
          <Typography
            onClick={toProfile}
            color="white"
            sx={{ cursor: 'pointer', fontSize: 18, ml: 3 }}>
            My account
          </Typography>
          <Typography
            onClick={toPasswordChange}
            color="white"
            sx={{ cursor: 'pointer', fontSize: 18, ml: 3 }}>
            Change password
          </Typography>
          <Typography color="white" sx={{ fontSize: 18, ml: 3 }}>
            Settings
          </Typography>
          <Stack alignItems="center" sx={{ mt: 1 }}>
            <Button onClick={signOut} variant="contained" sx={{ height: 30 }}>
              sign out
            </Button>
          </Stack>
        </Stack>
      </MyPopover>
    </>
  )
}
