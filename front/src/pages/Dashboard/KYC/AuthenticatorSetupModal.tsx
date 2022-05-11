import styled from '@emotion/styled'
import { ChangeEvent, useEffect, useState } from 'react'
import { ServicesProps, SingleServiceData, useServices } from 'hooks/useService'
import {
  enableAuthenticatorAuth,
  generateAuthenticatorQRCode
} from 'services/auth'
import Button from '@ui/Button/Button'
import Modal from '@ui/Modal/Modal'
import * as DashboardForm from '@ui/Dashboard/Form'
import { IAnim } from '@ui/utils/useAnimated'

export type AuthenticatorSetupModalProps = {
  anim: IAnim
  onClose: () => void
  onSuccess: () => void
}

const authServices = {
  enableAuthenticatorAuth,
  generateAuthenticatorQRCode
}

export function AuthenticatorSetupModal({
  onSuccess,
  onClose,
  anim
}: AuthenticatorSetupModalProps) {
  const [totp, setTOTP] = useState('')
  const authService = useServices(authServices)

  const handleTOTPInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 6) {
      event.target.value = event.target.value.slice(0, 6)
      setTOTP(event.target.value)
    } else {
      setTOTP(event.target.value)
    }
  }

  const enableAuthenticatorAuth = async () => {
    const data = await authService.enableAuthenticatorAuth(totp)
    if (data.result === 'success') {
      onSuccess()
    }
  }

  useEffect(() => {
    authService.generateAuthenticatorQRCode()
    // SAFETY: authService is an object that is redeclared on every render
    // so adding authService to deps could cause an infinite loop.
    // However, at the first run the authService is complete, so it is safe to use here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const secret: { qrcode: string; secret: string } | undefined =
    (authService.dataPerService.generateAuthenticatorQRCode.result ===
      'success' &&
      authService.dataPerService.generateAuthenticatorQRCode) ||
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
        <Messages authService={authService} />
      </ModalForm>
    </Modal>
  )
}

const Messages = (props: {
  authService: ServicesProps<typeof authServices>
}) => {
  if (props.authService.last === 'generateAuthenticatorQRCode') {
    return <GenerateQRCodeMessage data={props.authService.data} />
  }
  if (props.authService.last === 'enableAuthenticatorAuth') {
    return <EnableAuthenticatorAuthMessage data={props.authService.data} />
  }
  return (
    <DashboardForm.InfoMessage>
      Please setup MFA on authenticator application like Google authenticator
    </DashboardForm.InfoMessage>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface MessageProps<T extends (...args: any) => any> {
  data: SingleServiceData<T>
}

const GenerateQRCodeMessage = (
  props: MessageProps<typeof generateAuthenticatorQRCode>
) => {
  if (props.data.result === 'loading') return <></>
  if (props.data.result === 'success') return <></>
  return (
    <DashboardForm.ErrorMessage>
      Something went wrong. Please try again later.
    </DashboardForm.ErrorMessage>
  )
}

const EnableAuthenticatorAuthMessage = (
  props: MessageProps<typeof enableAuthenticatorAuth>
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

const Qr = styled.img`
  image-rendering: pixelated;
  object-fit: contain;
  flex: 1 2 100px;
`
const Secret = styled.div`
  text-align: left;
  box-sizing: border-box;
  border-radius: 8px;
  code {
    color: ${(props) => props.theme?.palette?.text?.primary};
    word-wrap: break-word;
    overflow-wrap: anywhere;
    flex: 1;
  }
`

export const ModalForm = styled('div')({
  display: 'flex',
  gap: '1em',
  padding: '1em',
  flexFlow: 'column'
})
