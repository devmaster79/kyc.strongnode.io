import React from 'react'
import styled from '@emotion/styled/macro'
import AccountPopover from '../../pages/Dashboard/AccountPopover/AccountPopover'
import IconToggle from '@ui/Button/IconToggle'
import useSettings from 'hooks/useSettings'
import ThemedLogo from '../../components/ThemedLogo'
import Media from 'theme/mediaQueries'

export const Navbar = () => {
  const { themeMode, onChangeMode } = useSettings()
  const handleChange = (checked: boolean) => {
    onChangeMode(checked ? 'dark' : 'light')
  }

  return (
    <NavbarWrapper>
      <StyledThemedLogo />

      <ThemeSwitchWrapper>
        <IconToggle
          checked={themeMode === 'dark'}
          id="theme"
          rightIcon="moon"
          leftIcon="sun"
          onChange={(event) => handleChange(event.target.checked)}
        />
      </ThemeSwitchWrapper>

      <AccountPopoverWrapper>
        <AccountPopover />
      </AccountPopoverWrapper>
    </NavbarWrapper>
  )
}

const ThemeSwitchWrapper = styled.div({
  '@media only screen and (min-width: 600px)': {
    display: 'none'
  },
  marginTop: '8px'
})
const NavbarWrapper = styled.div({
  width: 'calc(100% - 32px - 176px)',
  height: '20px',
  position: 'fixed',
  top: '32px',
  right: '32px',
  zIndex: '15',
  display: 'flex',
  justifyContent: 'space-between',
  verticalAlign: 'middle',
  [Media.phone]: {
    width: '100%',
    right: '0px',
    padding: '0px 24px'
  }
})

const AccountPopoverWrapper = styled.div({})

const StyledThemedLogo = styled(ThemedLogo)({
  '@media only screen and (min-width: 600px)': {
    display: 'none'
  },
  margin: '0px'
})
