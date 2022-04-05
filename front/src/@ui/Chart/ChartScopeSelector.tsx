import React, { useState } from 'react';
import styled from '@emotion/styled/macro';

type SelectorArray = {
  title: string,
  handler: any,
  scope: number
}
type ChartScopeSelectorProps = {
  selectors: Array<SelectorArray>,
  style?: object,
  className?: string
}

export const ChartScopeSelector = (props: ChartScopeSelectorProps) => {
  const [activeScope, setActiveScope] = useState(props.selectors[0].title);

  return (
    <SelectorWrapper style={props.style ? props.style : {}}>
      {props.selectors.map((selector, index) =>
        <SelectorButton key={selector.title} style={activeScope == selector.title ? activeSelectorStyle : {}} onClick={() => {selector.handler(selector.scope, selector.title);setActiveScope(selector.title)}}>{selector.title}
          <ButtonActiveLine style={activeScope == selector.title ? {opacity: 1} : {}} />
        </SelectorButton>
      )}
    </SelectorWrapper>
  );
};

const ButtonActiveLine = styled.div`
  width: 50%;
  height: 2px;
  position: absolute;
  left: 50%;
  bottom: -4px;
  background-color: #AA1FEC;
  transform: translateX(-50%);
  opacity: 0;
  transition: 250ms ease;
`

const SelectorButton = styled.div`
  position: relative;
  width: max-content;
  display: inline-block;
  text-transform: uppercase;
  vertical-align: middle;
  cursor: pointer;

  transition: 240ms ease;
  color: #141245;
  opacity: 0.4;
  
  &:hover {
    opacity: 1;
  }
  
  &:hover ${ButtonActiveLine} {
    opacity: 1;
  }
`;

const SelectorWrapper = styled.div`
  width: max-content;

  ${SelectorButton} {
    margin-left: 24px;
  }

  ${SelectorButton}:first-child {
    margin-left: 0px;
  }
`;

const activeSelectorStyle = {
  opacity: 1
}
