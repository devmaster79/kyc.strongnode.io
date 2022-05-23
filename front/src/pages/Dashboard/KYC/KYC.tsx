import { PasswordSwitch } from './PasswordSwitch'
import styled from '@emotion/styled'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as userService from 'services/userService'
import * as DashboardForm from '@ui/Dashboard/Form'
import { useEffect } from 'react'
import { AuthenticatorSwitch } from './AuthenticatorSwitch'
import { SMSSwitch } from './SMSSwitch'
import { WalletCarousel } from './WalletCarousel'
import * as ProgressCircleSteps from '@ui/Dashboard/ProgressCircleSteps'
import { Banner } from '../../../@ui/Banner/Banner'
import { useSnackbar } from 'notistack'

interface FormFields {
  firstName: string
  lastName: string
  username: string
  email: string
  enablePasswordAuth: boolean
  enableSMSAuth: boolean
  enableAuthenticatorAuth: boolean
}

const walletsObject = [
  {
    featureIcon: 0,
    label: 'ADD WALLET',
    description: ''
  },
  {
    featureIcon: 1,
    label: 'WALLET 1',
    description: '(2J33...wM2t)'
  },
  {
    featureIcon: 0,
    label: 'ADD WALLET',
    description: ''
  }
]

export default function KYC() {
  const { enqueueSnackbar } = useSnackbar()

  const { register, handleSubmit, reset, control, formState } =
    useForm<FormFields>({
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
    userService
      .getProfile()
      .then((response) => {
        if (response.result !== 'success') {
          throw new Error('Could not get the profile')
        }
        reset({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          username: response.data.user_name,
          email: response.data.email,
          enablePasswordAuth: response.data.enable_password,
          enableSMSAuth: response.data.enable_sms,
          enableAuthenticatorAuth: response.data.enable_authenticator
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }, [reset])

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await userService
      .updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        user_name: data.username,
        enable_password: data.enablePasswordAuth,
        enable_sms: data.enableSMSAuth,
        enable_authenticator: data.enableAuthenticatorAuth
      })
      .then((result) => {
        enqueueSnackbar(result.message, {
          variant: 'success'
        })
      })
  }

  return (
    <Container>
      <Banner
        title="StrongNode dVPN coming soon."
        description="Stay tuned for more information."
        soon
      />

      <h1>StrongNode ID and KYC</h1>
      <FormContainer>
        <ProgressCircleSteps.Container>
          <ProgressCircleSteps.Step
            label="user registration"
            progressAmount={60}
            progressLabel="A"
            progressBorder={false}
            disabled={false}
          />
          <ProgressCircleSteps.Separator />
          <ProgressCircleSteps.Step
            label="KYC"
            progressAmount={0}
            progressLabel="B"
            progressBorder={true}
            disabled={false}
          />
          <ProgressCircleSteps.Separator />
          <ProgressCircleSteps.Step
            label="Socials"
            progressAmount={0}
            progressLabel="D"
            progressBorder={true}
            disabled={true}
          />
          <ProgressCircleSteps.Separator />
          <ProgressCircleSteps.Step
            label="Optional"
            progressAmount={35}
            progressLabel="E"
            progressBorder={false}
            disabled={true}
          />
        </ProgressCircleSteps.Container>
        <DashboardForm.Form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off">
          <DashboardForm.InputGroup>
            <DashboardForm.Input
              inputProps={{
                placeholder: 'First name',
                ...register('firstName')
              }}
            />
            <DashboardForm.Input
              inputProps={{ placeholder: 'Last name', ...register('lastName') }}
            />
            <DashboardForm.Input
              inputProps={{ placeholder: 'Username', ...register('username') }}
            />
            <DashboardForm.Input
              inputProps={{
                placeholder: 'Email',
                ...register('email'),
                disabled: true
              }}
            />
          </DashboardForm.InputGroup>
          <DashboardForm.Hr />
          <DashboardForm.ButtonGroup>
            <Controller
              control={control}
              name="enablePasswordAuth"
              render={({ field, fieldState }) => (
                <PasswordSwitch
                  isDirty={fieldState.isDirty}
                  registerProps={field}
                />
              )}
            />
            <Controller
              control={control}
              name="enableAuthenticatorAuth"
              render={({ field, fieldState }) => (
                <AuthenticatorSwitch
                  isDirty={fieldState.isDirty}
                  registerProps={field}
                />
              )}
            />
            <Controller
              control={control}
              name="enableSMSAuth"
              render={({ field, fieldState }) => (
                <SMSSwitch isDirty={fieldState.isDirty} registerProps={field} />
              )}
            />
          </DashboardForm.ButtonGroup>
          <DashboardForm.Button
            variant="large"
            disabled={!formState.isDirty || formState.isSubmitting}>
            Update
          </DashboardForm.Button>
        </DashboardForm.Form>
      </FormContainer>
      <WalletCarousel walletProps={walletsObject} />
    </Container>
  )
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '95px',
  paddingBottom: '70px',
  gap: '32px',
  width: '80%',
  margin: 'auto',
  textAlign: 'center'
})

const FormContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '32px',
  width: '65%',
  margin: 'auto',
  '@media only screen and (max-width: 600px)': {
    width: '100%'
  }
})
