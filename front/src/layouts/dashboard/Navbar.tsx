import React from 'react'
import styled from '@emotion/styled/macro'
import AccountPopover from '../../pages/Dashboard/AccountPopover/AccountPopover'

const NavbarWrapper = styled.div`
  width: calc(100% - 32px - 176px);
  height: 20px;
  position: fixed;
  top: 32px;
  right: 32px;
  z-index: 15;
`

const AccountPopoverWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

interface NavbarProps {}

type NavbarState = {}

class Navbar extends React.Component<NavbarProps, NavbarState> {
  render () {
    return (
      <NavbarWrapper>
        <AccountPopoverWrapper>
          <AccountPopover />
        </AccountPopoverWrapper>
      </NavbarWrapper>
    )
  }
}

export default Navbar
