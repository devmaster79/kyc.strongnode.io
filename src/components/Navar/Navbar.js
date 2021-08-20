import React from 'react';
import { StyledNavbar, NavItemLink } from './style';

function Navbar({ children }) {
  return (
    <StyledNavbar>
      <NavItemLink to="/login">Login</NavItemLink>
      <NavItemLink to="/signup" fill>Sign up</NavItemLink>
    </StyledNavbar>
  )
}

export default Navbar;