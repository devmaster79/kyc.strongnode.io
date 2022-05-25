import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from 'services/auth'
import { OtherOptions } from '../../components/OtherOptions'
import { ServicesProps, useServices } from 'hooks/useService'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Message } from '@ui/Dashboard/Form'
import InputField from '@ui/Input/InputField'
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import { getFieldIssues } from 'utils/FormUtils'
import Media from './../../theme/mediaQueries'

const __initAuthServices = {
  sendSMSToUser: authService.sendSMSToUser,
  authBySMSCode: authService.authBySMSCode
}

interface SignInWithSMSFields {
  smsCode: string
}
export function SignInWithSMS() {
  const navigate = useNavigate()
  const services = useServices(__initAuthServices)

  const { register, handleSubmit, setError, formState } =
    useForm<SignInWithSMSFields>({
      defaultValues: {
        smsCode: ''
      }
    })

  const onSubmit: SubmitHandler<SignInWithSMSFields> = async (
    data: SignInWithSMSFields
  ) => {
    const response = await services.authBySMSCode(data.smsCode)
    if (response.result === 'success') {
      navigate('/sign-in-with-token')
    } else if (response.result === 'validation-error') {
      getFieldIssues(response).forEach(
        (val: { path: string | number; message: string }) => {
          const path = {
            smscode: 'smsCode' as const
          }[val.path]
          setError(path as 'smsCode', {
            message: val.message
          })
        }
      )
    }
  }

  // send sms after the component is loaded
  useEffect(() => {
    services.sendSMSToUser()
    // sendSMS is declared once and it is not changing so it is safe:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Title>
        <b>Strongnode</b>
        <br />
        2-STEP VERIFICATION
      </Title>
      <HelpTextContainer>
        <HelpText services={services} />
      </HelpTextContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <StyledInputField
          error={!!formState.errors.smsCode}
          helpText={formState.errors.smsCode?.message}
          inputProps={{
            placeholder: 'SMS Code',
            maxLength: 4,
            type: 'number',
            ...register('smsCode')
          }}
        />
        <Button variant="large">Confirm</Button>
        <OtherOptions hideSMS />
      </Form>
    </>
  )
}

type HelpTextProps = {
  services: ServicesProps<typeof __initAuthServices>
}

const HelpText = ({ services }: HelpTextProps) => {
  switch (services.data.result) {
    case 'waiting':
      return <Message></Message>
    case 'loading':
      return <Message>Loading...</Message>
    default:
      return (
        <Message error={services.data.result !== 'success'}>
          {services.data.message}
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
    fontWeight: 900
  },
  color: `${props.theme.palette.text.primary}`
}))

const HelpTextContainer = styled.div({
  margin: '32px 0 24px 0'
})
