import * as authState from '../../services/auth'
import styled from '@emotion/styled'
import { useService } from '../../hooks/useService'
import InputField from '@ui/Input/InputField'
import Button from '@ui/Button/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ErrorMessage, InfoMessage } from '@ui/Dashboard/Form'

interface VerifyEmailFields {
  email: string
}

export function VerifyEmail () {
  const { register, handleSubmit } = useForm<VerifyEmailFields>({
    defaultValues: {
      email: ''
    }
  })
  const { data: sendResult, call: sendVerificationEmail } = useService(
    authState.sendVerificationEmail
  )

  const onSubmit: SubmitHandler<VerifyEmailFields> = async (data) => {
    await sendVerificationEmail(data.email)
  }

  return (
    <>
      <Title>
        <b>Strongnode</b><br />
        Sign in / Register
      </Title>
      <HelpText>
        {sendResult.result === 'waiting' && 'We will send a magic link to your email'}
        {sendResult.result === 'loading' && (
          <InfoMessage>Sending the email...</InfoMessage>
        )}
        {sendResult.result === 'success' && (
          <InfoMessage>
            We have successfully sent you an email. You can close this tab
            now.
          </InfoMessage>
        )}
        {sendResult.result === 'validation-error' && (
          <ErrorMessage>Wrong email. Please try agian.</ErrorMessage>
        )}
        {sendResult.result === 'unexpected-error' && (
          <ErrorMessage>Something went wrong. Please try again later.</ErrorMessage>
        )}
      </HelpText>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          inputProps={{
            type: 'email',
            placeholder: 'Email',
            ...register('email')
          }}
        />
        <Button variant='large'>Confirm</Button>
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
`

const Title = styled.h1`
  font-style: normal;
  font-weight: 100;
  font-size: 32px !important;
  line-height: 43.2px;
  margin:0 !important;
  padding:0 !important;
  b {
    font-weight: 900;
  }

  color: ${props => props.theme.palette.text.primary};
`

const HelpText = styled.p`
  margin: 32px 0 24px 0;
`
