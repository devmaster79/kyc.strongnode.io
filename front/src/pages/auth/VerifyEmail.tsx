import authService from 'services/auth'
import styled from '@emotion/styled'
import { ServiceProps, useService } from '../../hooks/useService'
import InputField from '@ui/Input/InputField'
import Button from '@ui/Button/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Message } from '@ui/Dashboard/Form'
import { getFieldIssues } from 'utils/FormUtils'
import Media from './../../theme/mediaQueries'
interface VerifyEmailFields {
  email: string
}

export function VerifyEmail() {
  const { register, handleSubmit, setError, formState } =
    useForm<VerifyEmailFields>({
      defaultValues: {
        email: ''
      }
    })
  const { data: sendResponse, call: sendVerificationEmail } = useService(
    authService.sendVerificationEmail
  )

  const onSubmit: SubmitHandler<VerifyEmailFields> = async (data) => {
    const response = await sendVerificationEmail({
      body: data
    })
    if (response.result === 'validation-error') {
      getFieldIssues(response).forEach(
        (val: { path: 'email'; message: string }) => {
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
        Sign in / Register
      </Title>
      <HelpTextContainer>
        <HelpText response={sendResponse} />
      </HelpTextContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          error={!!formState.errors.email}
          helpText={formState.errors.email?.message}
          inputProps={{
            type: 'email',
            placeholder: 'Email',
            ...register('email')
          }}
        />
        <Button variant="large">Confirm</Button>
      </Form>
    </>
  )
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

const Title = styled.h1((props) => ({
  fontStyle: 'normal',
  fontWeight: '100',
  fontSize: '32px !important',
  lineHeight: '43.2px',
  margin: '0 !important',
  padding: '0 !important',
  b: {
    fontWeight: 900
  },
  color: props.theme.palette.text.primary
}))

type HelpTextProps = {
  response: ServiceProps<typeof authService.sendVerificationEmail>['data']
}

const HelpText = ({ response }: HelpTextProps) => {
  switch (response.result) {
    case 'waiting':
      return <Message>We will send a magic link to your email</Message>
    case 'loading':
      return <Message>Sending the email...</Message>
    default:
      return (
        <Message error={response.result !== 'success'}>
          {response.message}
        </Message>
      )
  }
}

const HelpTextContainer = styled.div({
  margin: '32px 0 24px 0'
})
