import styled, { CSSObject } from '@emotion/styled'
import { Icons } from '@ui/Icon/CustomIcons'
import Icon from '@ui/Icon/Icon'
import { ComponentProps, ReactNode } from 'react'

type InputParams = {
  className?: string,
  children?: ReactNode,
  inputProps?: ComponentProps<typeof StyledInputField>,
  icon?: keyof typeof Icons,
  error?: boolean,
  helpText?: ReactNode,
  floatingLabelWrapperProps?: FloatingLabelWrapperProps
}

export default function InputField (props: InputParams) {
  return (
    <InputContainer>
      <StyledInputWrapper
        error={props.error || false}
        className={props.className}
        disabled={props.inputProps?.disabled || false}
      >
        {props.icon && <Icon name={props.icon} />}

        <FloatingLabelWrapper {...props.floatingLabelWrapperProps}>
          <StyledInputField {...props.inputProps} placeholder=' ' />
          <FloatingLabel className='floating-label'>{props.inputProps?.placeholder}</FloatingLabel>
        </FloatingLabelWrapper>
      </StyledInputWrapper>
      {props.helpText && <HelpText error={props.error || false}>{props.helpText}</HelpText>}
    </InputContainer>
  )
}

export const InputContainer = styled.div`
  display: flex;
  flex-flow: column;
`

export const HelpText = styled.div<{error: boolean}>`
  text-align: left;
  padding: 0.3em 2em;
  ${props => props.error && `color: ${props.theme.palette.error.main}`}
`

export const FloatingLabel = styled.label`
  display: flex;
  align-items: center;
  position:absolute;
  left: ${6 / 14}em;
  top: ${6 / 14}em;
  padding: 0 ${10 / 14}em;
  font-size: 1em;
  transition-duration:300ms;
  pointer-events: none;
`

interface FloatingLabelWrapperProps {
  onFocusStyle?: CSSObject
}

export const FloatingLabelWrapper = styled('div', {
  shouldForwardProp: prop => prop !== 'onFocusStyle'
})<FloatingLabelWrapperProps>`
  position: relative;
  width: 100%;

  :focus-within > .floating-label,
  input:not(:placeholder-shown) + .floating-label,
  input:-webkit-autofill + .floating-label {
    padding-top:0;
    padding-bottom:0;
    transform:translateY(-18px);
    transition-duration:300ms;
    font-size: 12px;
    background-color: ${props => props.theme.palette.background.label};
    left: 3px;
    ${props => props.onFocusStyle}
  }
`

export const StyledInputWrapper = styled.div<{
  disabled: boolean,
  error: boolean
}>`
  flex:1;
  background: ${props => props.theme.palette.background.light};
  ${props => props.error
    ? `border: 1px solid ${props.theme.palette.error.light};`
    : `border: 1px solid ${props.theme.palette.border.light};`}
  box-sizing: border-box;
  border-radius: 8px;
  color: ${props => props.theme.palette.text.secondary};
  display: flex;
  align-items: center;
  min-width: 260px;
  opacity: ${props => props.disabled ? '0.5' : '1'};

  svg {
    margin-left: 8px;
  }
`

export const StyledInputField = styled.input`
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

  &:-webkit-autofill {
    -webkit-text-fill-color: ${props => props.theme.palette.text.primary};
    -webkit-box-shadow: 0 0 0px 1000px ${props => props.theme.palette.background.primary} inset;
    border-radius: 7px;
  }
`
