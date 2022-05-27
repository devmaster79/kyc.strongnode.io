import styled from '@emotion/styled'
import { ChangeEvent, useEffect, useState } from 'react'
import { ServicesProps, useServices } from 'hooks/useService'
import authService from 'services/auth'
import Button from '@ui/Button/Button'
import Modal from '@ui/Modal/Modal'
import * as DashboardForm from '@ui/Dashboard/Form'
import { IAnim } from '@ui/utils/useAnimated'
const { Message } = DashboardForm

export type AuthenticatorSetupModalProps = {
  anim: IAnim
  onClose: () => void
  onSuccess: () => void
}

const __initAuthServices = {
  enableAuthenticatorAuth: authService.enableAuthenticatorAuth,
  generateAuthenticatorQRCode: authService.generateAuthenticatorQRCode
}

export function AuthenticatorSetupModal({
  onSuccess,
  onClose,
  anim
}: AuthenticatorSetupModalProps) {
  const [totp, setTOTP] = useState('')
  const authServices = useServices(__initAuthServices)

  const handleTOTPInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 6) {
      event.target.value = event.target.value.slice(0, 6)
      setTOTP(event.target.value)
    } else {
      setTOTP(event.target.value)
    }
  }

  const enableAuthenticatorAuth = async () => {
    const data = await authServices.enableAuthenticatorAuth({
      body: { token: totp }
    })
    if (data.result === 'success') {
      onSuccess()
    }
  }

  useEffect(() => {
    authServices.generateAuthenticatorQRCode()
    // SAFETY: authServices is an object that is redeclared on every render
    // so adding authServices to deps could cause an infinite loop.
    // However, at the first run the authServices is complete, so it is safe to use here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const secret: { qrcode: string; secret: string } | undefined =
    (authServices.dataPerService.generateAuthenticatorQRCode.result ===
      'success' &&
      authServices.dataPerService.generateAuthenticatorQRCode) ||
    undefined

  return (
    <Modal
      anim={anim}
      title="Setup an Authenticator"
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
            onClick={enableAuthenticatorAuth}>
            Confirm
          </Button>
        </>
      }>
      <ModalForm>
        <DashboardForm.Row>
          {secret && <Qr src={secret.qrcode} />}
          <DashboardForm.Column>
            {secret && (
              <Secret>
                <p>
                  Scan the QR with an Authenticator or type the code manually:{' '}
                </p>
                <code>{secret.secret}</code>
              </Secret>
            )}
            <DashboardForm.Hr />
            <DashboardForm.ModalInput
              inputProps={{
                id: 'totp',
                value: totp,
                onChange: handleTOTPInputChange,
                placeholder: 'Enter your TOTP'
              }}
            />
          </DashboardForm.Column>
        </DashboardForm.Row>
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
      case 'generateAuthenticatorQRCode':
        return <></>
      case 'enableAuthenticatorAuth':
        return <VerifyingMessage />
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
const WaitingMessage = () => (
  <Message>
    Please setup MFA on authenticator application like Google authenticator
  </Message>
)

const Qr = styled.img({
  imageRendering: 'pixelated',
  objectFit: 'contain',
  flex: '1 2 100px'
})

const Secret = styled.div((props) => ({
  textAlign: 'left',
  boxSizing: 'border-box',
  borderRadius: '8px',
  code: {
    color: props.theme.palette.text.primary,
    wordWrap: 'break-word',
    overflowWrap: 'anywhere',
    flex: 1
  }
}))

const ModalForm = styled('div')({
  display: 'flex',
  gap: '1em',
  padding: '1em',
  flexFlow: 'column'
})
