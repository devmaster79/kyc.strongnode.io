import styled from '@emotion/styled';
import InputField, {
  FloatingLabelWrapper,
  StyledInputField,
  FloatingLabel
} from '@ui/Input/InputField';
import GenericButton from '@ui/Button/Button';
import { withAttrs } from '@ui/utils/withAttrs';

export const Input = withAttrs(
  styled(InputField)`
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
    }
    ${StyledInputField} {
      height: 56px;
    }
    ${FloatingLabel} {
      background: none;
      padding-top: 9px;
      top: 7px;
    }
  `,
  {
    floatingLabelWrapperProps: {
      onFocusStyle: {
        transform: 'translateY(-25px)',
        background: 'transparent'
      }
    }
  }
);

export const Button = styled(GenericButton)`
  margin: 0 20%;
  height: 56px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-flow: column;
  gap: 16px;
  width: 530px;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;
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
`;

export const Hr = styled.hr`
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0)
  );
`;

export const InfoMessage = styled('p')((props) => ({
  textAlign: 'center',
  marginBottom: '10px',
  color: props.theme.palette.info.main
}));

export const ErrorMessage = styled(InfoMessage)((props) => ({
  color: props.theme.palette.error.main
}));

export const Row = styled('div')({
  display: 'flex',
  gap: '1em'
});
