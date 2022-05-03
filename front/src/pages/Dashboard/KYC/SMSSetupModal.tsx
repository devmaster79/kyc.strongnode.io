import { useState, useEffect } from 'react'
import { sendSMSAndSaveNumber, enableSMSAuth } from 'services/auth'
import { useServices, SingleServiceData, ServicesProps } from 'hooks/useService'
import PhoneInput from 'material-ui-phone-number'
import Modal from '@ui/Modal/Modal'
import Button from '@ui/Button/Button'
import * as DashboardForm from '@ui/Dashboard/Form'
import styled from '@emotion/styled'
import { IAnim } from '@ui/utils/useAnimated'

const authServices = {
  sendSMSAndSaveNumber,
  verifyOTPAndEnableSMSAuth: enableSMSAuth
}

interface SMSSetupModalProps {
  onClose: () => void
  onSuccess: () => void
  anim: IAnim
}

export function SMSSetupModal({
  anim,
  onSuccess,
  onClose
}: SMSSetupModalProps) {
  const [smsCode, setSmsCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const authService = useServices(authServices)

  const setOTPValue = (val: string) => {
    val = val.slice(0, 4)
    setSmsCode(val)
  }

  const verifySMSCode = async () => {
    const data = await authService.verifyOTPAndEnableSMSAuth(smsCode)
    if (data.result === 'success') {
      onSuccess()
    }
  }

  return (
    <Modal
      anim={anim}
      title="Setup a new password"
      onClose={onClose}
      footer={
        <>
          <Button
            type="button"
            variant="medium"
            color="invert"
            onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="medium"
            onClick={() => verifySMSCode()}>
            Confirm
          </Button>
        </>
      }>
      <ModalForm>
        <DashboardForm.Row>
          <PhoneInput
            sx={{ flex: 1 }}
            label="Enter phone number"
            defaultCountry="us"
            onChange={(event) => {
              if (typeof event === 'string') {
                setPhoneNumber(event)
              }
            }}
          />
          <SendButtonWithCounter
            onClick={() => authService.sendSMSAndSaveNumber(phoneNumber)}
            disabled={authService.data.result === 'loading'}
          />
        </DashboardForm.Row>
        <DashboardForm.Input
          inputProps={{
            type: 'number',
            placeholder: 'Enter your SMS code',
            id: 'smsConfirm',
            value: smsCode,
            onChange: (event) => setOTPValue(event.target.value)
          }}
        />
        <Messages authService={authService} />
      </ModalForm>
    </Modal>
  )
}

const Messages = (props: {
  authService: ServicesProps<typeof authServices>
}) => {
  if (props.authService.last === 'sendSMSAndSaveNumber') {
    return <SendSMSAndSaveNumberMessage data={props.authService.data} />
  }
  if (props.authService.last === 'verifyOTPAndEnableSMSAuth') {
    return <VerifyOTPAndEnableSMSAuthMessage data={props.authService.data} />
  }
  return (
    <DashboardForm.InfoMessage>
      Fill in your phone number and we will send you a password.
    </DashboardForm.InfoMessage>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface MessageProps<T extends (...args: any) => any> {
  data: SingleServiceData<T>
}

const SendSMSAndSaveNumberMessage = (
  props: MessageProps<typeof sendSMSAndSaveNumber>
) => {
  if (props.data.result === 'loading') {
    return (
      <DashboardForm.InfoMessage>Sending the SMS...</DashboardForm.InfoMessage>
    )
  }
  if (props.data.result === 'success') {
    return (
      <DashboardForm.InfoMessage>
        We have sent you an SMS with the password.
      </DashboardForm.InfoMessage>
    )
  }
  if (props.data.result === 'banned') {
    return (
      <DashboardForm.ErrorMessage>
        We have sent you an SMS already. You can try it again
        {' ' + Math.floor(props.data.remainingTimeMs / 1000)} seconds later.
      </DashboardForm.ErrorMessage>
    )
  }
  if (props.data.result === 'validation-error') {
    return (
      <DashboardForm.ErrorMessage>
        Wrong phone number.
      </DashboardForm.ErrorMessage>
    )
  }
  return (
    <DashboardForm.ErrorMessage>
      We could not send you an SMS. Please try again later.
    </DashboardForm.ErrorMessage>
  )
}

const VerifyOTPAndEnableSMSAuthMessage = (
  props: MessageProps<typeof enableSMSAuth>
) => {
  if (props.data.result === 'loading') {
    return (
      <DashboardForm.InfoMessage>
        Verifying the password...
      </DashboardForm.InfoMessage>
    )
  }
  if (props.data.result === 'validation-error') {
    return (
      <DashboardForm.ErrorMessage>Wrong password.</DashboardForm.ErrorMessage>
    )
  }
  if (props.data.result === 'success') {
    return <DashboardForm.InfoMessage>Good!</DashboardForm.InfoMessage>
  }
  return (
    <DashboardForm.ErrorMessage>
      We could not verify your password. Please try again later.
    </DashboardForm.ErrorMessage>
  )
}

interface SendButtonWithCounterProps {
  onClick: () => void
  disabled: boolean
}

const SendButtonWithCounter = ({
  onClick,
  disabled
}: SendButtonWithCounterProps) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (count === 0) return
    const timeout = setTimeout(() => {
      if (count !== 0) {
        setCount(count - 1)
      }
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [count])

  return (
    <SendButton
      onClick={() => {
        setCount(30)
        onClick()
      }}
      disabled={disabled || count !== 0}>
      {count !== 0 ? count : 'Send'}
    </SendButton>
  )
}

const SendButton = styled(Button)({
  marginLeft: '10px',
  height: 'auto',
  flex: '0'
})

export const ModalForm = styled('div')({
  display: 'flex',
  gap: '1em',
  paddingTop: '1em',
  flexFlow: 'column'
})
