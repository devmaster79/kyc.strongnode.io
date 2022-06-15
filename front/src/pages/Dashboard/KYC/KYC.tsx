import { PasswordSwitch } from './PasswordSwitch'
import styled from '@emotion/styled'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import userService from 'services/userService'
import * as DashboardForm from '@ui/Dashboard/Form'
import { useEffect } from 'react'
import { AuthenticatorSwitch } from './AuthenticatorSwitch'
import { SMSSwitch } from './SMSSwitch'
import { WalletCarousel } from './WalletCarousel'
import * as ProgressCircleSteps from '@ui/Dashboard/ProgressCircleSteps'
import { Banner } from '../../../@ui/Banner/Banner'
import { useSnackbar } from 'notistack'
import { getFieldIssues } from 'utils/FormUtils'
import Media from './../../../theme/mediaQueries'
import authService from 'services/auth'
import { Response } from 'services/utils'

interface FormFields {
  firstName: string
  lastName: string
  username: string
  email: string
  enablePassword: boolean
  enableSms: boolean
  enableAuthenticator: boolean
  profileImgUrl: string
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

  const { register, handleSubmit, setError, formState, reset, control } =
    useForm<FormFields>({
      defaultValues: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        enablePassword: false,
        enableSms: false,
        enableAuthenticator: false,
        profileImgUrl: ''
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
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          username: response.data.username,
          email: response.data.email,
          enablePassword: response.data.enablePassword,
          enableSms: response.data.enableSms,
          enableAuthenticator: response.data.enableAuthenticator
        })
      })
      .done()
  }, [reset])

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    // eslint-disable-next-line promise/catch-or-return
    userService
      .updateProfile({
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          enablePassword: data.enablePassword || false,
          enableSms: data.enableSms || false,
          enableAuthenticator: data.enableAuthenticator || false
        }
      })
      .then((response) => {
        switch (response.result) {
          case 'validation-error':
            getFieldIssues(response).forEach((val) => {
              setError(val.path, {
                message: val.message
              })
            })
            break
          case 'success':
            localStorage.setItem('username', response.body.username)
            reset({
              firstName: response.body?.firstName,
              lastName: response.body?.lastName,
              username: response.body?.username,
              email: response.body?.email,
              enablePassword: response.body?.enablePassword,
              enableSms: response.body?.enableSms,
              enableAuthenticator: response.body?.enableAuthenticator
            })
        }
        return response
      })
      .thenEnqueueSnackbar(enqueueSnackbar)
      .done()
  }

  return (
    <Container>
      <Banner
        title="StrongNode dVPN coming soon."
        description="Stay tuned for more information."
        soon
      />

      <Title>StrongNode ID and KYC</Title>
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
              error={!!formState.errors.firstName}
              inputProps={{
                placeholder: 'First name',
                ...register('firstName')
              }}
            />
            <DashboardForm.Input
              error={!!formState.errors.lastName}
              inputProps={{ placeholder: 'Last name', ...register('lastName') }}
            />
            <DashboardForm.Input
              error={!!formState.errors.username}
              inputProps={{ placeholder: 'Username', ...register('username') }}
            />
            <DashboardForm.Input
              error={!!formState.errors.email}
              inputProps={{
                placeholder: 'Email',
                ...register('email'),
                disabled: true
              }}
            />
          </DashboardForm.InputGroup>
          <DashboardForm.Hr />

          {/*
            Note that the switches below have their own API calls. We use it in this form for just populating their values.
            This however limit their modal's abilities, because forms in forms are not valid, and buttons in forms submit the form by default.
            So keep attention for this.
            We cannot move them out because in the UI they are above the "Update" button, and manually submitting the form will be more complicated.
            Currently the best we can do is this.
          */}
          <DashboardForm.ButtonGroup>
            <Controller
              control={control}
              name="enablePassword"
              render={({ field, fieldState }) => (
                <PasswordSwitch
                  isDirty={fieldState.isDirty}
                  registerProps={{
                    ...field,
                    onChange: withDisableOnTurningOff(
                      field.onChange,
                      enqueueSnackbar,
                      authService.disablePasswordAuth
                    )
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="enableAuthenticator"
              render={({ field, fieldState }) => (
                <AuthenticatorSwitch
                  isDirty={fieldState.isDirty}
                  registerProps={{
                    ...field,
                    onChange: withDisableOnTurningOff(
                      field.onChange,
                      enqueueSnackbar,
                      authService.disableAuthenticatorAuth
                    )
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="enableSms"
              render={({ field, fieldState }) => (
                <SMSSwitch
                  isDirty={fieldState.isDirty}
                  registerProps={{
                    ...field,
                    onChange: withDisableOnTurningOff(
                      field.onChange,
                      enqueueSnackbar,
                      authService.disableSMSAuth
                    )
                  }}
                />
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

/**
 * An onChange decorator HOF that catches turning offs and in that case, it will disable the auth method for the user.
 * @param onChange The function that will be decorated
 * @param enqueueSnackbar Snackbar handler for messages about the result
 * @param disableEndpoint The endpoint which this function will call. Assuming that there will be no promise rejections, which is true for the the most the API calls.
 */
function withDisableOnTurningOff(
  onChange: (value: boolean) => void,
  enqueueSnackbar: ReturnType<typeof useSnackbar>['enqueueSnackbar'],
  disableEndpoint: () => Response<{ message: string; result: string }>
) {
  return (value: boolean) => {
    onChange(value)
    if (!value) {
      disableEndpoint().thenEnqueueSnackbar(enqueueSnackbar)
    }
  }
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
  textAlign: 'center',
  [Media.phone]: {
    width: '100%'
  }
})

const Title = styled.h1({
  [Media.phone]: {
    fontSize: '20px'
  }
})

const FormContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '32px',
  width: '65%',
  margin: 'auto',
  [Media.tablet]: {
    width: '100%'
  }
})
