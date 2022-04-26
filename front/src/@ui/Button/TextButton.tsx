import styled from '@emotion/styled';

const StyledButton = styled.button`
  font-style: normal;
  font-size: 16px;
  line-height: 140%;
  text-align: center;
  color: ${(props) => props.theme.palette.text.secondary};
  background: transparent;
  border: 0px;
  cursor: pointer;
`;

function TextButton({ children, ...props }: any) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

export default TextButton;
