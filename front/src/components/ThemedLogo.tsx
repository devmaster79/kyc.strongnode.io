import React from 'react'
import styled from 'styled-components'
import darkLogo from '../assets/SNE_logo_dark.png'
import lightLogo from '../assets/SNE_logo_light.png'

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
  return (
    <Logo className={className} src={lightLogo} alt="SNE logo" />
  )
}

export default ThemedLogo
