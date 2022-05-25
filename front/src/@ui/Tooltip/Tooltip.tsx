import React from 'react'
import styled from '@emotion/styled/macro'

type tooltipProps = {
  tooltip: string
  children?: React.ReactNode
}

const Tooltip = (props: tooltipProps) => {
  return (
    <TooltipContentWrapper>
      {props.children}
      <TooltipElement>{props.tooltip}</TooltipElement>
    </TooltipContentWrapper>
  )
}

export default Tooltip

const TooltipElement = styled.div({
  display: 'block',
  position: 'absolute',
  maxWidth: 'max-content',
  minWidth: '72px',
  paddingTop: '8px',
  paddingBottom: '8px',
  fontFamily: 'Satosh-Variable, Arial',
  fontStyle: 'normal',
  fontWeight: '900',
  fontSize: '12px',
  lineHeight: '16px',
  color: 'white',
  background: '#000000',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.25)',
  borderRadius: '8px',
  opacity: 0,
  transition: '250ms ease',
  left: '50%',
  transform: 'translateX(-50%) translateY(-10%)',
  top: '-56px',
  height: 'max-content',
  pointerEvents: 'none',

  '&:after': {
    content: "''",
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-2px)',
    marginLeft: '0px',
    borderWidth: '7px',
    borderStyle: 'solid',
    borderColor: '#000000 transparent transparent transparent'
  }
})

const TooltipContentWrapper = styled.div({
  position: 'relative',

  [`:hover ${TooltipElement}`]: {
    opacity: 1,
    transform: 'translateX(-50%) translateY(0%)'
  }
})
