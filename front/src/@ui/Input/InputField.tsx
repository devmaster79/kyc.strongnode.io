import styled, { CSSObject } from '@emotion/styled'
import { Icons } from '@ui/Icon/CustomIcons'
import Icon from '@ui/Icon/Icon'
import { ComponentProps, ReactNode } from 'react'

type InputParams = {
  className?: string
  children?: ReactNode
  inputProps?: ComponentProps<typeof StyledInputField>
  icon?: keyof typeof Icons
  error?: boolean
  helpText?: ReactNode
  floatingLabelWrapperProps?: FloatingLabelWrapperProps
}

export default function InputField(props: InputParams) {
  return (
    <InputContainer>
      <StyledInputWrapper
        error={props.error || false}
        className={props.className}
        disabled={props.inputProps?.disabled || false}>
        {props.icon && <Icon name={props.icon} />}

        <FloatingLabelWrapper {...props.floatingLabelWrapperProps}>
          <StyledInputField {...props.inputProps} placeholder=" " />
          <FloatingLabel className="floating-label">
            {props.inputProps?.placeholder} {props.error}
          </FloatingLabel>
        </FloatingLabelWrapper>
      </StyledInputWrapper>
      {props.helpText && (
        <HelpText error={props.error || false}>{props.helpText}</HelpText>
      )}
    </InputContainer>
  )
}

export const InputContainer = styled.div({
  display: 'flex',
  flexFlow: 'column'
})

export const HelpText = styled.div<{ error: boolean }>((props) => ({
  textAlign: 'left',
  padding: '0.3em 2em',
  color: props.error ? props.theme.palette.error.main : ''
}))

export const FloatingLabel = styled.label({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  left: `${6 / 14}em`,
  top: `${6 / 14}em`,
  padding: `0 ${10 / 14}em`,
  fontSize: '1em',
  transitionDuration: '300ms',
  pointerEvents: 'none'
})
interface FloatingLabelWrapperProps {
  onFocusStyle?: CSSObject
}

export const FloatingLabelWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'onFocusStyle'
})<FloatingLabelWrapperProps>((props) => ({
  position: 'relative',
  width: '100%',

  ':focus-within > .floating-label, input:not(:placeholder-shown) + .floating-label, input:-webkit-autofill + .floating-label':
    {
      paddingTop: 0,
      paddingBottom: 0,
      transform: 'translateY(-18px)',
      transitionDuration: '300ms',
      fontSize: '12px',
      backgroundColor: props.theme.palette.background.label,
      left: '3px'
      // `${props.onFocusStyle}`
    }
}))

export const StyledInputWrapper = styled.div<{
  disabled: boolean
  error: boolean
}>((props) => ({
  flex: 1,
  background: props.theme.palette.background.light,
  border: props.error
    ? `1px solid ${props.theme.palette.error.light}`
    : `1px solid ${props.theme.palette.border.light}`,
  boxSizing: 'border-box',
  borderRadius: '8px',
  color: props.theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  minWidth: '260px',
  opacity: props.disabled ? '0.5' : '1',

  svg: {
    marginLeft: '8px',
    height: '16px',
    width: '16px'
  }
}))

export const StyledInputField = styled.input((props) => ({
  display: 'block',
  width: '100%',
  height: '40px',
  background: 'transparent',
  border: '0px',
  color: props.theme.palette.text.primary,
  fontSize: '14px',
  paddingLeft: '8px',

  '::placeholder': {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: props.theme.palette.text.secondary,
    opacity: 1 /* Firefox */
  },

  ':-ms-input-placeholder': {
    /* Internet Explorer 10-11 */
    color: props.theme.palette.text.secondary
  },

  '::-ms-input-placeholder': {
    /* Microsoft Edge */
    color: props.theme.palette.text.secondary
  },

  '&:-webkit-autofill': {
    WebkitTextFillColor: props.theme.palette.text.primary,
    WebkitBoxShadow: `0 0 0px 1000px
    ${props.theme.palette.background.primary} inset`,
    borderRadius: '7px'
  }
}))
