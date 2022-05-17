import styled from '@emotion/styled'
import InputField, {
  FloatingLabelWrapper,
  StyledInputField,
  FloatingLabel
} from '@ui/Input/InputField'
import GenericButton from '@ui/Button/Button'

export const Input = styled(InputField)`
  background: ${(props) => props.theme.palette.background.input}!important;

  ${(props) =>
    props.error
      ? `border: 1px solid ${props.theme.palette.error.light};`
      : 'border: 1px solid rgba(255, 255, 255, 0.1);'}
  ${(props) =>
    props.error
      ? `background: ${props.theme.palette.error.light};`
      : 'background: rgba(255, 255, 255, 0.08);'}

  ${FloatingLabelWrapper} {
    font-size: 14px;
    :focus-within > .floating-label,
    input:not(:placeholder-shown) + .floating-label,
    input:-webkit-autofill + .floating-label {
      background: ${(props) => props.theme.palette.background.floatingLabel};
    }
  }
  ${StyledInputField} {
    height: 56px;
  }
  ${FloatingLabel} {
    background: none;
    padding-top: 9px;
    top: 7px;
  }
`

export const ModalInput = styled(Input)`
  background: ${(props) => props.theme.palette.background.inputModal}!important;

  ${FloatingLabelWrapper} {
    :focus-within > .floating-label,
    input:not(:placeholder-shown) + .floating-label,
    input:-webkit-autofill + .floating-label {
      background: ${(props) =>
        props.theme.palette.background.floatingModalInput};
  }
`

export const Button = styled(GenericButton)`
  margin: 0 20%;
  height: 56px;
`

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`

export const InputGroup = styled.div`
  display: flex;
  flex-flow: column;
  gap: 16px;
  width: 530px;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`
export const ButtonGroup = styled.div`
  display: flex;
  flex-flow: row;
  gap: 32px;
  width: 530px;
  padding-top: 24px;
  padding-bottom: 40px;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`

export const Hr = styled.hr`
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0)
  );
`

interface MessageProps {
  error?: boolean
}

export const Message = styled('p', {
  shouldForwardProp: (prop) => prop !== 'error'
})<MessageProps>((props) => ({
  textAlign: 'center',
  marginBottom: '10px',
  color: props.error
    ? props.theme.palette.error.main
    : props.theme.palette.info.main
}))

export const Row = styled('div')({
  display: 'flex',
  gap: '1em',
  flexWrap: 'wrap',
  justifyContent: 'center'
})

export const Column = styled('div')({
  flexFlow: 'column',
  display: 'flex',
  gap: '1em',
  flex: '1 1 100px'
})
