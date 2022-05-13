import styled from '@emotion/styled'

const StyledButton = styled.button`
  font-style: normal;
  font-size: 16px;
  line-height: 140%;
  text-align: center;
  color: ${(props) => props.theme.palette.text.secondary};
  background: transparent;
  border: 0px;
  cursor: pointer;
`

interface TextButtonProps {
  children?: string
  props?: {
    theme: {
      palette: {
        text: {
          secondary: string
        }
      }
    }
  }
  onClick: () => void
}

function TextButton({ children, ...props }: TextButtonProps) {
  return <StyledButton {...props}>{children}</StyledButton>
}

export default TextButton
