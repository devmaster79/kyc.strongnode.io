import { useNavigate } from 'react-router-dom'
import * as authService from 'services/auth'
import { ServiceProps, useService } from 'hooks/useService'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Message } from '@ui/Dashboard/Form'
import InputField from '@ui/Input/InputField'
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import { OtherOptions } from 'components/OtherOptions'
import { getFieldIssues } from 'utils/FormUtils'

interface SignInWithPasswordFields {
  password: string
}

export function SignInWithPassword() {
  const navigate = useNavigate()
  const { data: authResponse, call: authByPassword } = useService(
    authService.authByPassword
  )

  const { register, handleSubmit, setError, formState } =
    useForm<SignInWithPasswordFields>({
      defaultValues: {
        password: ''
      }
    })

  const onSubmit: SubmitHandler<SignInWithPasswordFields> = async (
    data: SignInWithPasswordFields
  ) => {
    const response = await authByPassword(data.password)
    if (response.result === 'success') {
      navigate('/sign-in-with-token')
    } else if (response.result === 'validation-error') {
      getFieldIssues(response).forEach(
        (val: { path: 'password'; message: string }) => {
          setError(val.path, {
            message: val.message
          })
        }
      )
    }
  }

  return (
    <>
      <Title>
        <b>Strongnode</b>
        <br />
        Welcome
      </Title>
      <HelpTextContainer>
        <HelpText response={authResponse} />
      </HelpTextContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <StyledInputField
          error={!!formState.errors.password}
          helpText={formState.errors.password?.message}
          inputProps={{
            placeholder: 'Password',
            type: 'password',
            ...register('password')
          }}
        />

        <Button variant="large">Confirm</Button>
        <OtherOptions hidePassword />
      </Form>
    </>
  )
}

type HelpTextProps = {
  response: ServiceProps<typeof authService.authByPassword>['data']
}

const HelpText = ({ response }: HelpTextProps) => {
  switch (response.result) {
    case 'waiting':
      return <Message></Message>
    case 'loading':
      return <Message>Loading...</Message>
    default:
      return (
        <Message error={response.result !== 'success'}>
          {response.message}
        </Message>
      )
  }
}

const HelpTextContainer = styled.div`
  margin: 32px 0 24px 0;
`

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
