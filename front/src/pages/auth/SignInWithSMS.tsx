import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from 'services/auth'
import { OtherOptions } from '../../components/OtherOptions'
import { useService } from 'hooks/useService'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ErrorMessage, InfoMessage } from '@ui/Dashboard/Form'
import InputField from '@ui/Input/InputField'
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'

const LENGTH_OF_SMS_CODE = 4
interface SignInWithSMSFields {
  smsCode: string
}
export function SignInWithSMS () {
  const { data: sendState, call: sendSMS } = useService(
    authService.sendSMSToUser
  )

  const { data: sendResult, call: authBySMSCode } = useService(
    authService.authBySMSCode
  )

  const { register, handleSubmit } = useForm<SignInWithSMSFields>({
    defaultValues: {
      smsCode: ''
    }
  })

  const onSubmit: SubmitHandler<SignInWithSMSFields> = async (data: SignInWithSMSFields) => {
    await authBySMSCode(data.smsCode)
  }

  // send sms after the component is loaded
  useEffect(() => {
    sendSMS()
  }, [])

  return (
    <>
      <Title>
        <b>Strongnode</b><br />
        2-STEP VERIFICATION
      </Title>
      <HelpText>
        {sendState.result === 'loading' && 'Sending the SMS...'}
        {sendState.result === 'success' &&
        'We have sent you an SMS to your given phone number.'}
        {sendState.result === 'unexpected-error' && (
          <ErrorMessage>
            We could not send you an SMS. Please try again later.
          </ErrorMessage>
        )}
        {sendState.result === 'unauthorized-error' && (
          <ErrorMessage>You do not have access to this feature.</ErrorMessage>
        )}
        {sendState.result === 'banned' && (
          <ErrorMessage>
            We have sent you an SMS already. You can try it again{' '}
            {Math.floor(sendState.remainingTimeMs / 1000)} seconds later.
          </ErrorMessage>
        )}
      </HelpText>
      {sendResult.result !== 'waiting' && sendResult.result !== sendState.result &&
        <HelpText>
          {sendResult.result === 'loading' && (<InfoMessage>'Validating...</InfoMessage>)}
          {sendResult.result === 'validation-error' && (
            <ErrorMessage>Invalid code please try again.</ErrorMessage>
          )}
          {sendResult.result === 'banned' && (
            <ErrorMessage>Too many trials, try again later.</ErrorMessage>
          )}
          {sendResult.result === 'unauthorized-error' && (
            <ErrorMessage>You do not have access to this feature.</ErrorMessage>
          )}
          {sendResult.result === 'unexpected-error' && (
            <ErrorMessage>
              Some error occurred during the authorization. Please try again
              later.
            </ErrorMessage>
          )}
        </HelpText>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <StyledInputField
          inputProps={{
            placeholder: 'SMS Code',
            maxLength: 4,
            type: 'number',
            ...register('smsCode')
          }}
        />
        <Button variant='large'>Confirm</Button>
        <OtherOptions hideSMS />
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
const HelpText = styled.p`
  margin: 32px 0 24px 0;
`
