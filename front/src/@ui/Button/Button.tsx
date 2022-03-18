import styled from '@emotion/styled'

const StyledButton = styled.button`
      background: linear-gradient(90.39deg, #AA1FEC 0.24%, #7A3BFE 101.6%);
      box-shadow: 0px 16px 40px rgba(170, 31, 236, 0.32), inset 0px 1px 1px rgba(255, 255, 255, 0.4);
      border-radius: 92px;
      font-family: 'Satoshi';
      font-style: normal;
      font-weight: 900;
      font-size: 12px;
      line-height: 100%;
      text-transform: uppercase;
      color: ${props => props.theme.palette.text.primary};
      padding: 12px 54px;
      border: 0px;
      margin: 16px 0px;
      cursor: pointer;
`


function Button({ children, ...props }: any) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

export default Button;
