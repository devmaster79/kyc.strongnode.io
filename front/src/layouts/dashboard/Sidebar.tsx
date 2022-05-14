import React from 'react'
import styled from '@emotion/styled/macro'
import ThemedLogo from '../../components/ThemedLogo'
import SidebarButtonWrapper from '../../@ui/Sidebar/SidebarButtonWrapper'
import IconToggle from '@ui/Button/IconToggle'
import useSettings from 'hooks/useSettings'

const SidebarWrapper = styled.div`
  width: 104px;
  height: 100%;
  flex-direction: column;
  flex: 1 0 auto;
  z-index: 1200;
  position: fixed;
  background: ${(props) => props.theme.palette.background.primary};
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

const ThemeSwitchWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 32px;
`

const Sidebar = () => {
  const { themeMode, onChangeMode } = useSettings()
  const handleChange = (checked: boolean) => {
    onChangeMode(checked ? 'dark' : 'light')
  }

  return (
    <SidebarWrapper>
      <StyledThemedLogo />
      <SidebarButtonWrapperStyled />
      <ThemeSwitchWrapper>
        <IconToggle
          checked={themeMode === 'dark'}
          id="theme"
          rightIcon="moon"
          leftIcon="sun"
          onChange={(event) => handleChange(event.target.checked)}
        />
      </ThemeSwitchWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar
