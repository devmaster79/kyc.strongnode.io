import * as authService from '../../services/auth'
import { useService } from 'hooks/useService'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputField from '@ui/Input/InputField'
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import { ErrorMessage, InfoMessage } from '@ui/Dashboard/Form'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getFieldIssues } from 'utils/FormUtils'

interface RegisterFields {
  first_name: string
  last_name: string
  user_name: string
}

export function Register() {
  const navigate = useNavigate()
  const [agreement, setAgreement] = useState(false)
  const { data: sendResult, call: registration } = useService(
    authService.register
  )

  const { register, handleSubmit, setError, formState } =
    useForm<RegisterFields>({
      defaultValues: {
        first_name: '',
        last_name: '',
        user_name: ''
      }
    })

  const onSubmit: SubmitHandler<RegisterFields> = async (
    data: RegisterFields
  ) => {
    const response = await registration({
      first_name: data.first_name,
      last_name: data.last_name,
      user_name: data.user_name
    })
    if (response.result === 'success') {
      navigate('/sign-in-with-token')
    } else if (response.result === 'validation-error') {
      getFieldIssues(response).forEach((val) => {
        setError(val.path, {
          message: val.message
        })
      })
    }
  }

  return (
    <>
      <Title>
        <b>Strongnode</b>
        <br />
        Register
      </Title>
      <HelpText>
        {sendResult.result === 'loading' && (
          <InfoMessage>Loading...</InfoMessage>
        )}
        {sendResult.result === 'limit-reached-error' && (
          <ErrorMessage>
            Sorry, but the maximum number of users limit is reached. We cannot
            allow new registrations.
          </ErrorMessage>
        )}
        {sendResult.result === 'unauthorized-error' && (
          <ErrorMessage>You do not have access to this feature.</ErrorMessage>
        )}
        {sendResult.result === 'unexpected-error' && (
          <ErrorMessage>Something went wrong.</ErrorMessage>
        )}
      </HelpText>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <StyledInputField
          error={!!formState.errors.user_name}
          helpText={formState.errors.user_name?.message}
          inputProps={{
            placeholder: 'Username',
            ...register('user_name')
          }}
        />
        <StyledInputField
          error={!!formState.errors.first_name}
          helpText={formState.errors.first_name?.message}
          inputProps={{
            placeholder: 'First name',
            ...register('first_name')
          }}
        />
        <StyledInputField
          error={!!formState.errors.last_name}
          helpText={formState.errors.last_name?.message}
          inputProps={{
            placeholder: 'Last name',
            ...register('last_name')
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

const Checkbox = styled.input`
  margin-right: 15px;
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
  color: ${(props) => props.theme?.palette?.text?.primary};
`
const HelpText = styled.div`
  margin: 32px 0 24px 0;
`

const Note = styled.p`
  margin: 20px;
`
