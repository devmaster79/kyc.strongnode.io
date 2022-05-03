import * as authService from 'services/auth'
import { OtherOptions } from '../../components/OtherOptions'
import { useService } from 'hooks/useService'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ErrorMessage, InfoMessage } from '@ui/Dashboard/Form'
import InputField from '@ui/Input/InputField'
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import { useNavigate } from 'react-router-dom'

interface SignInWithAuthenticatorFields {
  totp: string
}

export function SignInWithAuthenticator() {
  const navigate = useNavigate()
  const { data: authState, call: authByAuthenticator } = useService(
    authService.authByAuthenticator
  )

  const { register, handleSubmit } = useForm<SignInWithAuthenticatorFields>({
    defaultValues: {
      totp: ''
    }
  })

  const onSubmit: SubmitHandler<SignInWithAuthenticatorFields> = async (
    data: SignInWithAuthenticatorFields
  ) => {
    const response = await authByAuthenticator(data.totp)
    if (response.result === 'success') {
      navigate('/sign-in-with-token')
    }
  }

  return (
    <>
      <Title>
        <b>Strongnode</b>
        <br />
        2-STEP VERIFICATION
      </Title>
      <HelpText>
        {authState.result === 'loading' && (
          <InfoMessage>Verifying the TOTP...</InfoMessage>
        )}
        {authState.result === 'validation-error' && (
          <ErrorMessage>Wrong TOTP. Please try agian.</ErrorMessage>
        )}
        {authState.result === 'unexpected-error' && (
          <ErrorMessage>
            Something went wrong. Please try again later.
          </ErrorMessage>
        )}
        {authState.result === 'unauthorized-error' && (
          <ErrorMessage>You do not have access to this feature.</ErrorMessage>
        )}
        {authState.result === 'banned' && (
          <ErrorMessage>
            Too many trials. You can try it again{' '}
            {Math.floor(authState.remainingTimeMs / 1000)} seconds later.
          </ErrorMessage>
        )}
      </HelpText>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <StyledInputField
          inputProps={{
            placeholder: 'Enter your TOTP',
            maxLength: 6,
            ...register('totp')
          }}
        />
        <Button variant="large">Confirm</Button>
        <OtherOptions hideAuthenticator />
      </Form>
    </>
  )
}

const Form = styled.form`
  padding: 0 112px;
  width: 100%;
  margin-bottom: 40px;
  display: flex;
  flex-flow: column;

  @media only screen and (max-width: 600px) {
    padding: 0 10px;
  }
`

const StyledInputField = styled(InputField)`
  margin: 10px 0;
`
const Title = styled.h1`
  font-style: normal;
  font-weight: 100;
  font-size: 32px !important;
  line-height: 43.2px;
  margin: 0 !important;
  padding: 0 !important;
  b {
    font-weight: 900;
  }
  color: ${(props) => props.theme.palette.text.primary};
`
const HelpText = styled.div`
  margin: 32px 0 24px 0;
`
