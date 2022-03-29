import React from 'react';
import { StyledLine } from './style';

function Line({ children, ...props }) {
  return <StyledLine {...props}>{children}</StyledLine>;
}

export default Line;
