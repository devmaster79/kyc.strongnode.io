import { useState, useEffect, useCallback } from 'react'
import { Avatar, Stack, Typography } from '@material-ui/core'
import SvgIconStyle from 'components/SvgIconStyle'
import * as React from 'react';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { styled } from '@material-ui/core/styles'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const MyPopover = styled(Popover)`
  > div{ border-radius:30px !important;}
`
export default function AccountPopover() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    handleDashboard();
  })

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleDashboard = useCallback(
    async () => {
      try {
        if (localStorage.getItem("username") && localStorage.getItem("email")) {
          setUserName(localStorage.getItem("username"))
          setEmail(localStorage.getItem("email"))
        }
      } catch (err) {
        console.log("Error for email verification", err);
      }
    },
    []
  )
  const signOut = () => {
    window.localStorage.clear();
    navigate("/signin");
  }
  const toProfile =() => {
    navigate('/dashboard/profile');
  }
  

  return (
    <>
      <Stack
        direction="row"
        sx={{
          mr: { xs: 2, md: 0 },
          height: 54,
          width: { xs: 190, md: 270 },
          border: '2px solid rgba(238, 238, 238, 0.5)',
          background: 'linear-gradient(180deg, #7C1EFB 0%, #AF56BB 100%)',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '100px',
          pl: 1,
          pr: 2,
        }}
        alignItems="center"
        onClick={handleClick}
        justifyContent="space-between"
      >
        <Avatar src="/images/avatar.png" alt="avatar" />
          
        <Stack sx={{ color: 'black', ml: 2, mr: 2 }}>
          <Typography color="white" sx={{ fontSize: { md: 18, xs: 12 }, textAlign: 'center' }}>{userName}</Typography>
          <Typography color="white" sx={{ fontSize: { md: 12, xs: 8 }, textAlign: 'center' }}>
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
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          top: { xs: "-2vh", md: -12,lg:-3},
        }}
      >
        <Stack
          sx={{
            height: 210,
            width: { md: 270, xs: 190 },
            border: '2px solid rgba(238, 238, 238, 0.5)',
            background: 'linear-gradient(180deg, #7C1EFB 0%, #AF56BB 100%)',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '30px',
            pl: 1,
            pr: 1,
          }}

        >
          <Stack alignItems="center">
            <Avatar sx={{ mt: 2, }} src="/images/avatar.png" alt="avatar" />
            <Typography color="white" sx={{ fontSize: 18 }}>{userName}</Typography>
            <Typography color="white" sx={{ fontSize: 12 }}>
            {email}
            </Typography>
            <Divider light color="white" sx={{ width: 200 }} />
          </Stack>
          <Typography onClick={toProfile}  color="white" sx={{cursor:'pointer', fontSize: 18, ml: 3 }}>My account</Typography>
          <Typography color="white" sx={{ fontSize: 18, ml: 3 }}>Settings</Typography>
          <Stack alignItems="center" sx={{ mt: 1 }}>
            <Button onClick={signOut} variant="contained" sx={{ height: 30 }}>sign out</Button>
          </Stack>
        </Stack>
      </MyPopover>
    </>
  )
}
