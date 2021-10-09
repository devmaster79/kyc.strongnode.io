import { useState, useEffect, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Avatar, Stack, Typography } from "@material-ui/core";
import SvgIconStyle from "components/SvgIconStyle";
import * as React from "react";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import "./customPopover.css";
export default function AccountPopover() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    handleDashboard();
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleDashboard = useCallback(async () => {
    try {
      if (localStorage.getItem("username") && localStorage.getItem("email")) {
        setUserName(localStorage.getItem("username"));
        setEmail(localStorage.getItem("email"));
      }
    } catch (err) {
      console.log("Error for email verification", err);
    }
  }, []);

  return (
    <>
      <Stack
        direction="row"
        sx={{
          height: 54,
          width: { xs: 170, md: 270 },
          border: "2px solid rgba(238, 238, 238, 0.5)",
          background: "linear-gradient(180deg, #7C1EFB 0%, #AF56BB 100%)",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          borderRadius: "100px",
          pl: 1,
          pr: 2,
        }}
        alignItems="center"
        onClick={handleClick}
        justifyContent="space-between"
      >
        <Avatar src="/images/avatar.png" alt="avatar" />
        <Stack sx={{ color: "black", ml: 2, mr: 2 }}>
          <Typography color="white" sx={{ fontSize: { md: 18, xs: 14 } }}>
            {userName}
          </Typography>
          <Typography color="white" sx={{ fontSize: { md: 12, xs: 10 } }}>
            {email}
          </Typography>
        </Stack>
        <SvgIconStyle
          src="/icons/arrow-down.svg"
          sx={{ width: "16px", height: "8px", backgroundColor: "black" }}
        />
      </Stack>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          top: { xs: -11, md: -3 },
        }}
      >
        <Stack
          sx={{
            height: 210,
            width: { md: 270, xs: 170 },
            border: "2px solid rgba(238, 238, 238, 0.5)",
            background: "linear-gradient(180deg, #7C1EFB 0%, #AF56BB 100%)",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "30px",
            pl: 1,
            pr: 1,
          }}
        >
          <Stack alignItems="center">
            <Avatar sx={{ mt: 2 }} src="/images/avatar.png" alt="avatar" />
            <Typography color="white" sx={{ fontSize: 18 }}>
              Lois James
            </Typography>
            <Typography color="white" sx={{ fontSize: 12 }}>
              David@email.com
            </Typography>
            <Divider light color="white" sx={{ width: 200 }} />
          </Stack>
          <Typography
            component={RouterLink}
            to="/dashboard/profile"
            color="white"
            sx={{ fontSize: 18, ml: 3, cursor: "pointer" }}
          >
            My account
          </Typography>
          <Typography color="white" sx={{ fontSize: 18, ml: 3 }}>
            Settings
          </Typography>
          <Stack alignItems="center" sx={{ mt: 1 }}>
            <Button variant="contained" sx={{ height: 30 }}>
              sign out
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
}
