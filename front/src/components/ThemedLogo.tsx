import React from 'react'
import styled from 'styled-components'
import darkLogo from '../assets/SNE_logo_dark.png'
import lightLogo from '../assets/SNE_logo_light.png'
import { useTheme } from '@mui/styles'

const Logo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  cursor: pointer;
`

type ButtonProps = {
  className?: string;
}

const ThemedLogo = ({ className }: ButtonProps) => {
  const theme: any = useTheme()
  let isDark = theme.palette.mode === 'dark'

  return (
    <span>
      {isDark &&
        <Logo className={className} src={lightLogo} alt="SNE logo" />
      }
      {!isDark &&
        <Logo className={className} src={darkLogo} alt="SNE logo" />
      }
    </span>
  )
}

export default ThemedLogo
