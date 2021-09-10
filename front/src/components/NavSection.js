import { useState } from 'react';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, List, ListItemText, ListItemIcon, ListItemButton } from '@material-ui/core';


const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.body2,
  height: 52,
  margin: '15px 0px',
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 26,
  height: 26,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

function NavItem({ item, active, isShow }) {
  const isActiveRoot = active(item.path);
  const { title, path, icon } = item;

  const activeRootStyle = {
    color: 'white',
    borderRadius: '16px',
    bgcolor: '#4D79F6',
  };

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        pl: '12px',
        ...(isActiveRoot && activeRootStyle)
      }}
    >
      <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
      {isShow && <ListItemText disableTypography primary={title} />}
    </ListItemStyle>
  );
}

export default function NavSection({ navConfig, isShow = true, ...other }) {
  const { pathname } = useLocation();
  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);

  return (
    <Box {...other} sx={{ padding: '55px 39px' }}>
      {navConfig.map((list) => {
        const { subheader, items } = list;
        return (
          <List key={subheader} disablePadding>
            {items.map((item) => (
              <NavItem key={item.title} item={item} active={match} isShow={isShow} />
            ))}
          </List>
        );
      })}
    </Box>
  );
}
