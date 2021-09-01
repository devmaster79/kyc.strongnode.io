import React from "react";
import { StyledNavbar, NavItemLink, NavItem, UserInfoWrapper } from "./style";
import { ReactComponent as AvatarIcon } from "../../icons/avatar.svg";
import { ReactComponent as DropdownIcon } from "../../icons/dropdown.svg";

function Navbar({ children, ...props }) {
  return (
    <StyledNavbar {...props}>
      <NavItemLink to="/">kyc.strongnode.io</NavItemLink>
      <NavItem>
        <AvatarIcon />
        <UserInfoWrapper>
          <p>John</p>
          <span>admin@email.com</span>
        </UserInfoWrapper>
        <DropdownIcon />
      </NavItem>
    </StyledNavbar>
  );
}

export default Navbar;