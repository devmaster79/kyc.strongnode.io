import React from 'react'
import styled from '@emotion/styled/macro'

import SidebarButtonWrapper from '../../@ui/Sidebar/SidebarButtonWrapper'

export const BottomBar = () => {
  return (
    <BottombarWrapper>
      <SidebarButtonWrapper isBottombar={true}></SidebarButtonWrapper>
    </BottombarWrapper>
  )
}

const BottombarWrapper = styled.div((props) => ({
  width: '100%',
  position: 'fixed',
  bottom: '0px',
  zIndex: '999',
  background: props.theme.palette.background.primary,
  boxShadow: 'inset 0px 1px 0px rgba(255, 255, 255, 0.12)',
  '@media only screen and (min-width: 600px)': {
    display: 'none'
  }
}))
