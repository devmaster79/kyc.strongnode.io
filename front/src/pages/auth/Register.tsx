import authService from 'services/auth'
import { ServiceProps, useService } from 'hooks/useService'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputField from '@ui/Input/InputField'
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import { Message } from '@ui/Dashboard/Form'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getFieldIssues } from 'utils/FormUtils'
import Media from './../../theme/mediaQueries'
interface RegisterFields {
  firstName: string
  lastName: string
  username: string
}

export function Register() {
  const navigate = useNavigate()
  const [agreement, setAgreement] = useState(false)
  const { data: response, call: registration } = useService(
    authService.register
  )

  const { register, handleSubmit, setError, formState } =
    useForm<RegisterFields>({
      defaultValues: {
        firstName: '',
        lastName: '',
        username: ''
      }
    })

  const onSubmit: SubmitHandler<RegisterFields> = async (
    data: RegisterFields
  ) => {
    const response = await registration({
      body: {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username
      }
    })
    if (response.result === 'success') {
      navigate('/sign-in-with-token')
    } else if (response.result === 'validation-error') {
      getFieldIssues(response).forEach(
        (val: {
          path: 'firstName' | 'lastName' | 'username'
          message: string
        }) => {
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
        Register
      </Title>
      <HelpTextContainer>
        <HelpText response={response} />
      </HelpTextContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <StyledInputField
          error={!!formState.errors.username}
          helpText={formState.errors.username?.message}
          inputProps={{
            placeholder: 'Username',
            ...register('username')
          }}
        />
        <StyledInputField
          error={!!formState.errors.firstName}
          helpText={formState.errors.firstName?.message}
          inputProps={{
            placeholder: 'First name',
            ...register('firstName')
          }}
        />
        <StyledInputField
          error={!!formState.errors.lastName}
          helpText={formState.errors.lastName?.message}
          inputProps={{
            placeholder: 'Last name',
            ...register('lastName')
          }}
        />
        <span>
          <Checkbox
            type="checkbox"
            checked={agreement}
            onChange={() => setAgreement(!agreement)}
          />
          By continuing, you agree to{' '}
          <Link to="/terms-of-use" target="_blank">
            Terms of Use
          </Link>{' '}
          <Link to="/privacy-policy" target="_blank">
            Privacy Policy
          </Link>
          .
        </span>
        <Note>
          After completing the registration, we will subscribe you to our
          mailing list. We will only send you emails to let you know when{' '}
          <b>Early Access</b> is available for StrongNode Edge products
        </Note>
        <Button variant="large" disabled={!agreement}>
          Confirm
        </Button>
      </Form>
    </>
  )
}

type HelpTextProps = {
  response: ServiceProps<typeof authService.register>['data']
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

const HelpTextContainer = styled.div({
  margin: '32px 0 24px 0'
})

const Checkbox = styled.input({
  marginRight: '15px'
})

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

const Note = styled.p({
  margin: '20px'
})
