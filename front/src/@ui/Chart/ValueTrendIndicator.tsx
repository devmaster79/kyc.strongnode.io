import React from 'react'
import styled from '@emotion/styled/macro'

type ValueTrendIndicatorProps = {
  value: string
  up: boolean
}

export const ValueTrendIndicator = (props: ValueTrendIndicatorProps) => {
  return (
    <ValueIndicatorWrapper>
      <p>{props.value}</p>
      <CustomSvg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5Z"
          fill="#C4C4C4"
        />
        <path
          d="M8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5Z"
          fill={props.up ? '#54C093' : '#e64929'}
        />
        <path
          style={props.up ? {} : arrowDownStyle}
          d="M6.42066 9.5C5.61163 9.5 5.13748 8.58932 5.60142 7.92654L7.18077 5.67033C7.57887 5.10162 8.42113 5.10161 8.81923 5.67033L10.3986 7.92654C10.8625 8.58931 10.3884 9.5 9.57934 9.5H6.42066Z"
          fill="white"
        />
      </CustomSvg>
    </ValueIndicatorWrapper>
  )
}

const CustomSvg = styled.svg((props) => ({
  path: {
    transition: '250ms ease',
    transformOrigin: 'center',
    transform: 'rotate(0deg)'
  },

  'path:nth-child(3)': {
    fill: `${props.theme.palette.icon.active}`
  }
}))

const ValueIndicatorWrapper = styled.div((props) => ({
  width: 'max-content',
  color: `${props.theme.palette.text.primary}`,

  p: {
    fontWeight: 900,
    width: 'max-content',
    display: 'inline-block',
    verticalAlign: 'middle',
    opacity: '0.4',
    color: `${props.theme.palette.text.primary}`
  },

  svg: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: '8px'
  }
}))

const arrowDownStyle = {
  transform: 'rotate(180deg)',
  transformOrigin: 'center'
}
