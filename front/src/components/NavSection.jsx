import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 52,
    margin: '15px 0px',
    position: 'relative',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
    '&:hover': {
      color: 'white',
      borderRadius: '16px',
      background: 'linear-gradient(180deg, #AF56B8 0%, #7C1EFB 100%)',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.25)'
    }
  })
);

const ListItemIconStyle = styled(ListItemIcon)({
  width: 26,
  height: 26,
  marginRight: 12,
  marginLeft: '11px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
});

function NavItem({ item, active, isShow }) {
  const isActiveRoot = active(item.path);
  const { title, path, icon } = item;

  const activeRootStyle = {
    color: 'white',
    borderRadius: '16px',
    background: 'linear-gradient(180deg, #AF56B8 0%, #7C1EFB 100%)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.25)'
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
      <ListItemIconStyle>{icon}</ListItemIconStyle>
      {isShow && <ListItemText sx={{ color: 'white' }} disableTypography primary={title} />}
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
