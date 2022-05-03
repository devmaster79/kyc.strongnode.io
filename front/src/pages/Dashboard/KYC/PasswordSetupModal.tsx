import styled from '@emotion/styled'
import { useState } from 'react'
import { ServicesProps, useServices } from 'hooks/useService'
import { enablePasswordAuth } from 'services/auth'
import * as DashboardForm from '@ui/Dashboard/Form'

import Modal from '@ui/Modal/Modal'
import Button from '@ui/Button/Button'
import { IAnim } from '@ui/utils/useAnimated'

const authServices = {
  enablePasswordAuth
}

export interface PasswordSetupModalProps {
  onClose: () => void
  onSuccess: () => void
  anim: IAnim
}

export function PasswordSetupModal({
  onSuccess,
  onClose,
  anim
}: PasswordSetupModalProps) {
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const authService = useServices(authServices)

  const enablePasswordAuth = async () => {
    const data = await authService.enablePasswordAuth(password1)
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
          <Button type="button" variant="medium" onClick={enablePasswordAuth}>
            Set Password
          </Button>
        </>
      }>
      <ModalForm>
        <DashboardForm.Input
          inputProps={{
            autoComplete: 'false',
            type: 'password',
            placeholder: 'Enter your password',
            value: password1,
            onChange: (event) => setPassword1(event.target.value)
          }}
        />
        <DashboardForm.Input
          inputProps={{
            autoComplete: 'false',
            type: 'password',
            placeholder: 'Enter your password again',
            value: password2,
            onChange: (event) => setPassword2(event.target.value)
          }}
          error={password1 !== password2}
          helpText={
            password1 && password1 !== password2 && 'Passwords do not match'
          }
        />
        <Messages authService={authService} />
      </ModalForm>
    </Modal>
  )
}

const Messages = (props: {
  authService: ServicesProps<typeof authServices>
}) => {
  if (props.authService.data.result === 'waiting') return <></>
  if (props.authService.data.result === 'loading') {
    return <Info>Verifying the password...</Info>
  }
  if (props.authService.data.result === 'validation-error') {
    return <Error>Wrong password.</Error>
  }
  if (props.authService.data.result === 'success') {
    return <Info>Password has been set successfully!</Info>
  }
  return (
    <Error>We could not verify your password. Please try again later.</Error>
  )
}

const Error = styled('p')({
  textAlign: 'center',
  marginBottom: '10px',
  color: '#d74646'
})

const Info = styled('p')({
  textAlign: 'center',
  marginBottom: '10px',
  color: '#dddddd'
})

const ModalForm = styled('div')({
  width: '100%',
  display: 'flex',
  flexFlow: 'column',
  gap: '1em',
  padding: '2em'
})
