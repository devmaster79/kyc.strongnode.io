import styled from 'styled-components';

export const StyledInputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
  position: relative;
  label {
    display: inline-block;
    margin-bottom: 0.5rem;
    color: #88888;
  }
  svg {
    fill  : white;
    position: absolute;
    top: calc(50% - 1px);
    left: 15px;
    transform: translateY(-50%);
  }
`