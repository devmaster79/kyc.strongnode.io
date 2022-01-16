import styled from 'styled-components';

export const StyledInput = styled.input`
  width: 100%;
  max-width: 402px;
  height: 52px;
  outline: none;
  padding: 16px 20px;
  border-radius: 6px;
  font-size: 18px;
  color: #888888;
  transition: box-shadow 0.2s;
  background: rgba(238, 238, 238, 0.0001);
  border: 1px solid #1DF4F6;
  box-sizing: border-box;
  box-shadow: inset 0px 10px 10px rgba(0, 0, 0, 0.25);
  color : white;
  &::placeholder {
    color: white;
  font-size: 18px;
  }
  &:focus {
    box-shadow: 0 0 0 2px rgb(169, 172, 255, 0.5);
  }
`