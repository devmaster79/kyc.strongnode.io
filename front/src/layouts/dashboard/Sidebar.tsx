import React from 'react'
import styled from '@emotion/styled/macro'
import ThemedLogo from '../../components/ThemedLogo'
import SidebarButtonWrapper from '../../@ui/Sidebar/SidebarButtonWrapper'
import ThemeSwitch from '../../components/ThemeSwitch'

const SidebarWrapper = styled.div`
  width: 104px;
  height: 100%;
  flex-direction: column;
  flex: 1 0 auto;
  z-index: 1200;
  position: fixed;
  background: ${props => props.theme.palette.background.primary};
  box-shadow: inset -1px 0px 0px rgba(255, 255, 255, 0.12);
  
  @media only screen and (max-width: 600px) {
    display: none;
  }
`

const StyledThemedLogo = styled(ThemedLogo)`
  margin: 32px;
`

const SidebarButtonWrapperStyled = styled(SidebarButtonWrapper)`
  margin-top: 60px;
`

const themeSwitchStyles = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  bottom: '32px'
}

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <StyledThemedLogo />
      <SidebarButtonWrapperStyled />
      <ThemeSwitch sx={themeSwitchStyles} color={{}} />
    </SidebarWrapper>
  )
}

export default Sidebar
