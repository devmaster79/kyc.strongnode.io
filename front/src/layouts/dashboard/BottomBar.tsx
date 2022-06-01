import React from 'react'
import styled from '@emotion/styled/macro'

import SidebarButtonWrapper from '../../@ui/Sidebar/SidebarButtonWrapper'
import Media from 'theme/mediaQueries'
import { ButtonWrapper } from '@ui/Sidebar/SidebarButton'

export const BottomBar = () => {
  return (
    <BottombarWrapper>
      <SidebarButtonWrapper isBottomBar={true}></SidebarButtonWrapper>
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
  display: 'none',
  [Media.phone]: {
    display: 'block'
  },
  [ButtonWrapper.toString()]: {
    borderTop: '2px #AA1FEC solid'
  }
}))
