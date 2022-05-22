import React from 'react'
import styled from '@emotion/styled/macro'
import background from '../../assets/images/banner_background.png'

export type BannerProps = {
  title: string
  description: string
  soon?: boolean
}

export const Banner = (props: BannerProps) => {
  // todo
  return (
    <BannerWrapper>
      <TextWrapper>
        <Title>{props.title}</Title>
        <Description>{props.description}</Description>
      </TextWrapper>
      {props.soon && <ComingSoon>Soon</ComingSoon>}
    </BannerWrapper>
  )
}

const BannerWrapper = styled.div({
  backgroundImage: `url(${background})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxSizing: 'border-box',
  borderRadius: '10px',
  width: '90%',
  height: '112px',
  overflow: 'hidden',
  position: 'relative',

  '@media only screen and (max-width: 600px)': {
    height: 'max-content'
  }
})

const TextWrapper = styled.div({
  position: 'absolute',
  left: '32px',
  top: '50%',
  transform: 'translateY(-50%)',

  '@media only screen and (max-width: 600px)': {
    position: 'static',
    transform: 'none',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '16px',
    textAlign: 'center'
  }
})

const Title = styled.p({
  fontWeight: 'bold',
  fontSize: '24px',
  lineHeight: '100%',
  color: 'white'
})

const Description = styled.p({
  fontSize: '24px',
  color: '#ffffff'
})

const ComingSoon = styled.div({
  position: 'absolute',
  top: '50%',
  right: '32px',
  transform: 'translateY(-50%)',
  display: 'block',
  width: 'max-content',
  height: 'max-content',
  background: '#141343',
  boxShadow: '0px 1px 0px rgba(255, 255, 255, 0.25)',
  borderRadius: '102px',
  padding: '13px 88px',
  textTransform: 'uppercase',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '100%',
  color: 'rgba(255, 255, 255, 0.6)',

  '@media only screen and (max-width: 600px)': {
    position: 'static',
    transform: 'none',
    marginTop: '32px',
    marginBottom: '16px',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})
