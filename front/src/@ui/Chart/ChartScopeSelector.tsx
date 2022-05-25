import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { XAxisFormat } from './BaseChart'

export type SelectorItem = {
  title: XAxisFormat
  handler: (value: XAxisFormat) => void
}
type ChartScopeSelectorProps = {
  selectors: SelectorItem[]
  style?: object
  className?: string
}

export const ChartScopeSelector = (props: ChartScopeSelectorProps) => {
  const [activeScope, setActiveScope] = useState(props.selectors[0].title)

  return (
    <SelectorWrapper style={props.style ? props.style : {}}>
      {props.selectors.map((selector, index) => (
        <SelectorButton
          key={selector.title}
          style={activeScope === selector.title ? activeSelectorStyle : {}}
          onClick={() => {
            selector.handler(selector.title)
            setActiveScope(selector.title)
          }}>
          {selector.title}
          <ButtonActiveLine
            style={activeScope === selector.title ? { opacity: 1 } : {}}
          />
        </SelectorButton>
      ))}
    </SelectorWrapper>
  )
}

const ButtonActiveLine = styled.div({
  width: '50%',
  height: '2px',
  position: 'absolute',
  left: '50%',
  bottom: '-4px',
  backgroundColor: '#aa1fec',
  transform: 'translateX(-50%)',
  opacity: 0,
  transition: '250ms ease'
})

const SelectorButton = styled.div((props) => ({
  position: 'relative',
  width: 'max-content',
  display: 'inline-block',
  textTransform: 'uppercase',
  verticalAlign: 'middle',
  cursor: 'pointer',

  transition: '240ms ease',
  color: props.theme.palette.text.primary,
  opacity: 0.4,

  '&:hover': {
    opacity: 1
  },

  [`:hover ${ButtonActiveLine}`]: {
    opacity: 1
  }
}))

const SelectorWrapper = styled.div({
  width: 'max-content',

  [`${SelectorButton}`]: {
    marginLeft: '24px'
  },

  [`${SelectorButton}:first-child`]: {
    marginLeft: '0px'
  }
})

const activeSelectorStyle = {
  opacity: 1
}
