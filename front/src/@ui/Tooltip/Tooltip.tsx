import React from 'react';
import styled from '@emotion/styled/macro';

const TooltipElement = styled.div`
  display: block;
  position: absolute;
  max-width: max-content;
  min-width: 72px;
  padding-top: 8px;
  padding-bottom: 8px;
  font-family: 'Satosh-Variable', Arial;
  font-style: normal;
  font-weight: 900;
  font-size: 12px;
  line-height: 16px;
  color: white;
  background: #000000;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  opacity: 0;
  transition: 250ms ease;
  left: 50%;
  transform: translateX(-50%) translateY(-10%);
  top: -56px;
  height: max-content;

  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-2px);
    margin-left: 0px;
    border-width: 7px;
    border-style: solid;
    border-color: #000000 transparent transparent transparent;
  }
`

const TooltipContentWrapper = styled.div`
  position: relative;

  &:hover ${TooltipElement} {
    opacity: 1;
    transform: translateX(-50%) translateY(0%);
  }
`

type tooltipProps = {
  tooltip: string,
  children?: any
}

const Tooltip = (props: tooltipProps) => {
  return (
    <TooltipContentWrapper>
      {props.children}
      <TooltipElement>
        {props.tooltip}
      </TooltipElement>
    </TooltipContentWrapper>
  )
}

export default Tooltip
