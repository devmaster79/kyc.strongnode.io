import { useNavigate } from 'react-router-dom'
import * as authService from 'services/auth'
import { useService } from 'hooks/useService'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ErrorMessage, InfoMessage } from '@ui/Dashboard/Form'
import InputField from '@ui/Input/InputField'
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import { OtherOptions } from 'components/OtherOptions'
interface SignInWithPasswordFields {
  password: string
}

export function SignInWithPassword () {
  const navigate = useNavigate()
  const { data: sendResult, call: authByPassword } = useService(
    authService.authByPassword
  )

  const { register, handleSubmit } = useForm<SignInWithPasswordFields>({
    defaultValues: {
      password: ''
    }
  })

  const onSubmit: SubmitHandler<SignInWithPasswordFields> = async (data: SignInWithPasswordFields) => {
    const response = await authByPassword(data.password)
    if (response.result === 'success') {
      navigate('/sign-in-with-token')
    }
  }

  return (
    <>
      <Title>
        <b>Strongnode</b><br />
        Welcome
      </Title>
      <HelpText>
        {sendResult.result === 'loading' && (<InfoMessage>Loading...</InfoMessage>)}
        {sendResult.result === 'validation-error' && (
          <ErrorMessage>
            Wrong password. Please try agian.
          </ErrorMessage>
        )}
        {sendResult.result === 'unauthorized-error' && (
          <ErrorMessage>You do not have access to this feature.</ErrorMessage>
        )}
        {sendResult.result === 'unexpected-error' && (
          <ErrorMessage>Something went wrong.</ErrorMessage>
        )}
        {sendResult.result === 'banned' && (
          <ErrorMessage>
            Too many trials. You can try it again{' '}
            {Math.floor(sendResult.remainingTimeMs / 1000)} seconds later.
          </ErrorMessage>
        )}
      </HelpText>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <StyledInputField
          inputProps={{
            placeholder: 'Password',
            type: 'password',
            ...register('password')
          }}
        />

        <Button variant='large'>Confirm</Button>
        <OtherOptions hidePassword />
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

const StyledInputField = styled(InputField)`
  margin: 10px 0;
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
const HelpText = styled.div`
  margin: 32px 0 24px 0;
`
