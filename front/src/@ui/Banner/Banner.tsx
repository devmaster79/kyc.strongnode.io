import React from 'react';
import styled from '@emotion/styled/macro'
import background from '../../assets/images/banner_background.png'

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

type bannerProps = {
  title: string,
  description: string
}

const Banner = (props: bannerProps) => {
  // todo
  return (
    <BannerWrapper>
      <TextWrapper>
        <Title>{ props.title }</Title>
        <Description>{ props.description }</Description>
      </TextWrapper>
    </BannerWrapper>
  )
};

export default Banner
