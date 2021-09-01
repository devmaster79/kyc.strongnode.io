import styled from 'styled-components';

export const StyledButton = styled.button`
  width: ${props => props.full ? '100%' : null};
  min-width: 64px;
  height: 52px;
  border: 1px solid #2f8bfd;
  border-radius: 4px;
  padding: 8px 16px;
  outline: none;
  background-color: ${props => props.white ? '#ffffff' : '#2f8bfd'};
  color: ${props => props.white ? '#2f8bfd' : '#ffffff'};;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02857rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background-color: ${props => props.white ? '#ffffff' : '#2f8bfd'};; }
`