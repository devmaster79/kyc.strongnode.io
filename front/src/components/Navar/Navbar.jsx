import React, { useState, useEffect } from 'react'
import { StyledNavbar, NavItemLink, NavItem, UserInfoWrapper } from './style'
import { ReactComponent as AvatarIcon } from '../../icons/avatar.svg'
import { ReactComponent as DropdownIcon } from '../../icons/dropdown.svg'

function Navbar({ children, ...props }) {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    setUserName(localStorage.getItem('user_name'))
    setEmail(localStorage.getItem('email'))
  }, [])

  return (
    <StyledNavbar {...props}>
      <NavItemLink to="/">kyc.strongnode.io</NavItemLink>
      <NavItem>
        <AvatarIcon />
        <UserInfoWrapper>
          <p>{userName}</p>
          <span>{email}</span>
        </UserInfoWrapper>
        <DropdownIcon />
      </NavItem>
    </StyledNavbar>
  )
}

export default Navbar
