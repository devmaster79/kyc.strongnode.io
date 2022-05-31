import React from 'react'
import styled from '@emotion/styled/macro'

interface IIconRectangleButton {
  title: string
  description: string
  onClick?: () => void
  icon?: string
  iconAlt?: string
  style?: React.CSSProperties
}

export const IconRectangleButton = (props: IIconRectangleButton) => {
  return (
    <ButtonWrapper style={props.style} onClick={props.onClick}>
      {props.icon && (
        <ButtonIcon
          src={props.icon}
          alt={props.iconAlt ? props.iconAlt : 'Wallet connect method icon'}
        />
      )}
      <div>
        <Title>{props.title}</Title>
        <DescriptionText>{props.description}</DescriptionText>
      </div>
      <ArrowRight src={'/icons/arrow-right.svg'} alt={'Right arrow'} />
    </ButtonWrapper>
  )
}

const Title = styled.h3((props) => ({
  fontFamily: "'Satoshi-Variable', Arial",
  fontWeight: 900,
  fontSize: '18px',
  lineHeight: '24px',
  textAlign: 'left',
  color: props.theme.palette.text.primary
}))

const DescriptionText = styled.p((props) => ({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '100%',
  textAlign: 'center',
  color: props.theme.palette.text.primary,
  opacity: 0.6,
  marginTop: '6px'
}))

const ArrowRight = styled.img((props) => ({
  width: '8px',
  height: '16px',
  position: 'absolute',
  right: '24px',
  top: '50%',
  transform: 'translateY(-50%)',
  transition: '250ms ease'
}))

const ButtonWrapper = styled.button((props) => ({
  position: 'relative',
  background: 'rgba(110, 109, 143, 0.04)',
  border: '1px solid rgba(110, 109, 143, 0.12)',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  minHeight: '72px',
  minWidth: '400px',
  cursor: 'pointer',
  transition: '250ms ease',

  [`:hover ${ArrowRight}`]: {
    transform: 'translateY(-50%) translateX(-4px)'
  },

  [`:hover`]: {
    border: '1px solid rgba(110, 109, 143, 0.25)',
    background: 'rgba(110, 109, 143, 0.25)'
  }
}))

const ButtonIcon = styled.img((props) => ({
  display: 'block',
  width: '40px',
  height: '40px',
  marginRight: '16px'
}))
