import styled from '@emotion/styled'

const StyledButton = styled.button((props) => ({
  fontStyle: 'normal',
  fontSize: '16px',
  lineHeight: '140%',
  textAlign: 'center',
  color: `${props.theme.palette.text.secondary}`,
  background: 'transparent',
  border: '0px',
  cursor: 'pointer'
}))

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
