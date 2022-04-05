import styled from '@emotion/styled'
import Icon from '@ui/Icon/Icon'

function InputField ({ children, ...props }: any) {
  return <StyledInputWrapper>
    { props.icon && <Icon name={props.icon} /> }
    <StyledInputField {...props} />
  </StyledInputWrapper>
}

export default InputField

const StyledInputWrapper = styled.div`
  background: ${props => props.theme.palette.background.secondary};
  border: 1px solid ${props => props.theme.palette.border.light};
  box-sizing: border-box;
  border-radius: 8px;
  color: ${props => props.theme.palette.text.secondary};
  padding: 13px;
  display: flex;
  align-items: center;
  min-width: 260px;
`

const StyledInputField = styled.input`
  background: transparent;
  border: 0px;
  color: ${props => props.theme.palette.text.primary};
  font-size: 14px;
  padding-left: 8px;

  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${props => props.theme.palette.text.secondary};
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: ${props => props.theme.palette.text.secondary};
  }

  ::-ms-input-placeholder { /* Microsoft Edge */
    color: ${props => props.theme.palette.text.secondary};
  }
`
