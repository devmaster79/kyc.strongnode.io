import { useState, useEffect } from 'react'
import { useServices, ServicesProps } from 'hooks/useService'
import PhoneInput from 'material-ui-phone-number'
import Modal from '@ui/Modal/Modal'
import Button from '@ui/Button/Button'
import * as DashboardForm from '@ui/Dashboard/Form'
import styled from '@emotion/styled'
import { IAnim } from '@ui/utils/useAnimated'
import authService from 'services/auth'
const { Message } = DashboardForm

const __initAuthServices = {
  sendSMSAndSaveNumber: authService.sendSMSAndSaveNumber,
  verifyOTPAndEnableSMSAuth: authService.enableSMSAuth
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
  const authServices = useServices(__initAuthServices)

  const setOTPValue = (val: string) => {
    val = val.slice(0, 4)
    setSmsCode(val)
  }

  const verifySMSCode = async () => {
    const data = await authServices.verifyOTPAndEnableSMSAuth({
      body: { smscode: smsCode }
    })
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
            onClick={() =>
              authServices.sendSMSAndSaveNumber({
                body: {
                  number: phoneNumber
                }
              })
            }
            disabled={authServices.data.result === 'loading'}
          />
        </DashboardForm.Row>
        <DashboardForm.ModalInput
          inputProps={{
            type: 'number',
            placeholder: 'Enter your SMS code',
            id: 'smsConfirm',
            value: smsCode,
            onChange: (event) => setOTPValue(event.target.value)
          }}
        />
        <Messages authServices={authServices} />
      </ModalForm>
    </Modal>
  )
}

const Messages = (props: {
  authServices: ServicesProps<typeof __initAuthServices>
}) => {
  const services = props.authServices
  if (services.data.result === 'waiting') {
    return <WaitingMessage />
  }
  if (services.data.result === 'loading') {
    switch (services.last) {
      case 'verifyOTPAndEnableSMSAuth':
        return <VerifyingMessage />
      case 'sendSMSAndSaveNumber':
        return <SendingMessage />
      case null:
        throw new Error('Unreachable')
    }
  }
  return (
    <Message error={services.data.result !== 'success'}>
      {services.data.message}
    </Message>
  )
}
const VerifyingMessage = () => <Message>Verifying the password...</Message>
const SendingMessage = () => <Message>Sending the SMS...</Message>
const WaitingMessage = () => (
  <Message>Fill in your phone number and we will send you a password.</Message>
)

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

const ModalForm = styled('div')({
  display: 'flex',
  gap: '1em',
  paddingTop: '1em',
  flexFlow: 'column'
})
