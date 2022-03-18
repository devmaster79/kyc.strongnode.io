import React from 'react'
import styled from 'styled-components'
import ThemedLogo from '../../components/ThemedLogo'
import SidebarButtonWrapper from '../../components/dashboard/sidebar/SidebarButtonWrapper'

const SidebarWrapper = styled.div`
  width: 104px;
  height: 100%;
  flex-direction: column;
  flex: 1 0 auto;
  z-index: 1200;
  position: fixed;
  background: #141245;
  box-shadow: inset -1px 0px 0px rgba(255, 255, 255, 0.12);
`

const StyledThemedLogo = styled(ThemedLogo)`
  margin: 32px;
`

const SidebarButtonWrapperStyled = styled(SidebarButtonWrapper)`
  margin-top: 60px;
`

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <StyledThemedLogo />
      <SidebarButtonWrapperStyled />
    </SidebarWrapper>
  )
}

export default Sidebar
