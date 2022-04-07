import styled from '@emotion/styled'
import { Icons } from '@ui/Icon/CustomIcons'
import Icon from '@ui/Icon/Icon'
import { HTMLAttributes, ReactNode } from 'react'

type InputParams = {
  children?: ReactNode,
  inputProps?: HTMLAttributes<HTMLInputElement>,
  icon?: keyof typeof Icons
}

function InputField (props: InputParams) {
  return <StyledInputWrapper>
    { props.icon && <Icon name={props.icon} /> }

    <FloatingLabelWrapper>
      <StyledInputField {...props.inputProps} placeholder=" " />
      <FloatingLabel className="floating-label">{props.inputProps?.placeholder}</FloatingLabel>
    </FloatingLabelWrapper>
  </StyledInputWrapper>
}

export default InputField

const FloatingLabel = styled.label`
  position:absolute;
  top: 7px;
  background-color: ${props => props.theme.palette.background.label};
  padding: 0 10px;
  font-size: 16px;
  transition-duration:300ms;
  pointer-events: none;
`

const FloatingLabelWrapper = styled.div`
  position: relative;
  width: 100%;

  :focus-within > .floating-label, input:not(:placeholder-shown) + .floating-label {
    transform:translateY(-16px);
    transition-duration:300ms;
    font-size: 12px;
  }
`

const StyledInputWrapper = styled.div`
  background: ${props => props.theme.palette.background.light};
  border: 1px solid ${props => props.theme.palette.border.light};
  box-sizing: border-box;
  border-radius: 8px;
  color: ${props => props.theme.palette.text.secondary};
  padding-left: 13px;
  display: flex;
  align-items: center;
  min-width: 260px;
`

const StyledInputField = styled.input`
  display:block;
  width:100%;
  height:40px;
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
