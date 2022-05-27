import { OtherOptions } from '../../components/OtherOptions'
import { ServiceProps, useService } from 'hooks/useService'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Message } from '@ui/Dashboard/Form'
import InputField from '@ui/Input/InputField'
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import { useNavigate } from 'react-router-dom'
import { getFieldIssues } from 'utils/FormUtils'
import authService from 'services/auth'
import Media from './../../theme/mediaQueries'
interface SignInWithAuthenticatorFields {
  totp: string
}

export function SignInWithAuthenticator() {
  const navigate = useNavigate()
  const { data: authResponse, call: authByAuthenticator } = useService(
    authService.authByAuthenticator
  )

  const { register, handleSubmit, setError, formState } =
    useForm<SignInWithAuthenticatorFields>({
      defaultValues: {
        totp: ''
      }
    })

  const onSubmit: SubmitHandler<SignInWithAuthenticatorFields> = async (
    data: SignInWithAuthenticatorFields
  ) => {
    const response = await authByAuthenticator({
      body: {
        token: data.totp
      }
    })
    if (response.result === 'success') {
      navigate('/sign-in-with-token')
    } else if (response.result === 'validation-error') {
      getFieldIssues(response).forEach(
        (val: { path: string | number; message: string }) => {
          const path = {
            token: 'totp' as const
          }[val.path]
          setError(path as 'totp', {
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
        2-STEP VERIFICATION
      </Title>
      <HelpTextContainer>
        <HelpText response={authResponse} />
      </HelpTextContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <StyledInputField
          error={!!formState.errors.totp}
          helpText={formState.errors.totp?.message}
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

type HelpTextProps = {
  response: ServiceProps<typeof authService.authByAuthenticator>['data']
}

const HelpText = ({ response }: HelpTextProps) => {
  switch (response.result) {
    case 'waiting':
      return <Message></Message>
    case 'loading':
      return <Message>Verifying the TOTP...</Message>
    default:
      return (
        <Message error={response.result !== 'success'}>
          {response.message}
        </Message>
      )
  }
}

const Form = styled.form({
  padding: '0 112px',
  width: '100%',
  marginBottom: '40px',
  display: 'flex',
  flexFlow: 'column',

  [Media.phone]: {
    padding: '0 10px'
  }
})

const StyledInputField = styled(InputField)({
  margin: '10px 0'
})

const Title = styled.h1((props) => ({
  fontStyle: 'normal',
  fontWeight: '100',
  fontSize: '32px !important',
  lineHeight: '43.2px',
  margin: '0 !important',
  padding: '0 !important',
  b: {
    fontWeight: '900'
  },
  color: props.theme.palette.text.primary
}))

const HelpTextContainer = styled.div({
  margin: '32px 0 24px 0'
})
