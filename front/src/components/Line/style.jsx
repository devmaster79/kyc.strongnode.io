import styled from 'styled-components'

export const StyledLine = styled.div`
  width: ${(props) => (props.full ? '100%' : '20%')};
  height: 1px;
  background: #bcb7c7;
  margin-top: 40px;
`
