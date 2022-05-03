import React from 'react'
import { StyledInputGroup } from './style'

/** @deprecated Please don't realy on this as it is unnecessary and it makes mui components buggy */
function InputGroup({ children }) {
  return <StyledInputGroup>{children}</StyledInputGroup>
}

export default InputGroup
