import styled from '@emotion/styled'

export const StyledButton = styled.button`
  width: ${(props) => (props.full ? '100%' : null)};
  min-width: 64px;
  height: 40px;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  outline: none;
  background: #aa1fec;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);
  color: white;
  font-size: 19px;
  letter-spacing: 0.02857rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    box-shadow: 0px 5px 5px rgba(255, 255, 255, 0.25);
  }
`
