import React from 'react'
import styled from '@emotion/styled/macro'
import background from '../../assets/images/banner_background.png'

export type BannerProps = {
  title: string,
  description: string,
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
      {props.soon &&
        <ComingSoon>
          Soon
        </ComingSoon>}
    </BannerWrapper>
  )
}

const BannerWrapper = styled.div`
  background-image: url("${background}");
  background-repeat: no-repeat;
  background-size: cover;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-sizing: border-box;
  border-radius: 10px;
  width: 90%;
  height: 112px;
  overflow: hidden;
  position: relative;
`

const TextWrapper = styled.div`
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
`

const Title = styled.p`
  font-weight: bold;
  font-size: 24px;
  line-height: 100%;
  color: white;
`

const Description = styled.p`
  font-size: 24px;
  color: #FFFFFF;
  color: white;
`

const ComingSoon = styled.div`
  position: absolute;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  display: block;
  width: max-content;
  height: max-content;
  background: #141343;
  box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.25);
  border-radius: 102px;
  padding: 13px 88px;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: rgba(255, 255, 255, 0.6)
`
