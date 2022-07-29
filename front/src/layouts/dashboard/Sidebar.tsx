import React from 'react'
import styled from '@emotion/styled/macro'
import ThemedLogo from '../../components/ThemedLogo'
import SidebarButtonWrapper from '../../@ui/Sidebar/SidebarButtonWrapper'
import IconToggle from '@ui/Button/IconToggle'
import useSettings from 'hooks/useSettings'
import Media from './../../theme/mediaQueries'

const SidebarWrapper = styled.div((props) => ({
  width: '104px',
  height: '100%',
  flexDirection: 'column',
  flex: '1 0 auto',
  zIndex: '1200',
  position: 'fixed',
  background: props.theme.palette.background.primary,
  boxShadow: 'inset -1px 0px 0px rgba(255, 255, 255, 0.12)',

  [Media.phone]: {
    display: 'none'
  }
}))

const StyledThemedLogo = styled(ThemedLogo)({
  margin: '32px'
})

const SidebarButtonWrapperStyled = styled(SidebarButtonWrapper)({
  marginTop: '60px'
})

const ThemeSwitchWrapper = styled.div({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  bottom: '32px'
})

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
          leftTooltip="Light mode"
          rightTooltip="Dark mode"
          onChange={(event) => handleChange(event.target.checked)}
        />
      </ThemeSwitchWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar
