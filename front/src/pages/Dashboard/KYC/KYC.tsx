import { PasswordSwitch } from './PasswordSwitch'
import styled from '@emotion/styled'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as userService from 'services/userService'
import * as DashboardForm from '@ui/Dashboard/Form'
import { useEffect } from 'react'
import { AuthenticatorSwitch } from './AuthenticatorSwitch'
import { SMSSwitch } from './SMSSwitch'
interface FormFields {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  enablePasswordAuth: boolean,
  enableSMSAuth: boolean,
  enableAuthenticatorAuth: boolean,
}

export default function KYC () {
  const { register, handleSubmit, reset, control, formState } = useForm<FormFields>({
    mode: 'all',
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      enablePasswordAuth: false,
      enableSMSAuth: false,
      enableAuthenticatorAuth: false
    }
  })

  useEffect(() => {
    userService.getProfile().then(result => {
      const data = result.data[0]
      reset({
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.user_name,
        email: data.email,
        enablePasswordAuth: data.enable_password,
        enableSMSAuth: data.enable_sms,
        enableAuthenticatorAuth: data.enable_authenticator
      })
    }).catch(err => {
      console.error(err)
    })
  }, [reset])

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await userService.updateProfile({
      first_name: data.firstName,
      last_name: data.lastName,
      user_name: data.username,
      enable_password: data.enablePasswordAuth,
      enable_sms: data.enableSMSAuth,
      enable_authenticator: data.enableAuthenticatorAuth
    })
  }

  return (
    <Container>
      <h1>StrongNode ID and KYC</h1>
      <DashboardForm.Form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <DashboardForm.InputGroup>
          <DashboardForm.Input inputProps={{ placeholder: 'First name', ...register('firstName') }} />
          <DashboardForm.Input inputProps={{ placeholder: 'Last name', ...register('lastName') }} />
          <DashboardForm.Input inputProps={{ placeholder: 'Username', ...register('username') }} />
          <DashboardForm.Input inputProps={{ placeholder: 'Email', ...register('email'), disabled: true }} />
        </DashboardForm.InputGroup>
        <DashboardForm.Hr />
        <DashboardForm.ButtonGroup>
          <Controller
            control={control}
            name='enablePasswordAuth'
            render={({ field, fieldState }) => (
              <PasswordSwitch isDirty={fieldState.isDirty} registerProps={field} />
            )}
          />
          <Controller
            control={control}
            name='enableAuthenticatorAuth'
            render={({ field, fieldState }) => (
              <AuthenticatorSwitch isDirty={fieldState.isDirty} registerProps={field} />
            )}
          />
          <Controller
            control={control}
            name='enableSMSAuth'
            render={({ field, fieldState }) => (
              <SMSSwitch isDirty={fieldState.isDirty} registerProps={field} />
            )}
          />
        </DashboardForm.ButtonGroup>
        <DashboardForm.Button
          variant='large'
          disabled={!formState.isDirty || formState.isSubmitting}
        >
          Update
        </DashboardForm.Button>
      </DashboardForm.Form>
    </Container>
  )
}

export const PasswordSetupModal = () => <div>Settings</div>

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 95px;
  gap: 32px;
  width: 50%;
  margin:auto;
`
