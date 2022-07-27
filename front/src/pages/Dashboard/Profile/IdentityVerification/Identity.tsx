import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import * as DashboardForm from '@ui/Dashboard/Form'
import { useState, useEffect } from 'react'
import IdentityUpload from './IdentityUpload/IdentityUpload'
import useSettings from 'hooks/useSettings'
import {
  UploadIdentityPhoto,
  UploadUserWithIdentityPhoto,
  VerifyIdentity
} from 'shared/endpoints/kyc'
import kycService from 'services/kycService'
import { SnackbarKey, useSnackbar } from 'notistack'
import InputField from '@ui/Input/InputField'
import { Controller, useForm } from 'react-hook-form'
import { DateInput } from '@ui/Input/DateInput'
import { useOutletContext } from 'react-router-dom'
import { ProfileOutletContext } from '../Profile'
import { Alert } from '@ui/Alert'

interface IFormFields {
  firstName: string
  lastName: string
  birthday: string
}

export default function Identity() {
  const { profile, resetProfile } = useOutletContext<ProfileOutletContext>()
  const { formState, register, control, handleSubmit, reset } =
    useForm<IFormFields>({
      mode: 'all',
      defaultValues: {
        firstName: '',
        lastName: '',
        birthday: ''
      }
    })
  const [uploadIdentityPhotoResult, setUploadIdentityPhotoResult] =
    useState<UploadIdentityPhoto.Response | null>(null)
  const [
    uploadUserWithIdentityPhotoResult,
    setuploadUserWithIdentityPhotoResult
  ] = useState<UploadUserWithIdentityPhoto.Response | null>(null)
  const snackbar = useSnackbar()
  useEffect(() => {
    reset({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      birthday: profile.birthday || ''
    })
  }, [profile, reset])

  const { themeMode } = useSettings()
  const isLight = themeMode === 'light'

  async function onSubmit(data: IFormFields) {
    const iterator = kycService.verifyIdentity({
      body: data
    })
    let lastSnack: SnackbarKey | undefined = undefined
    const closeLast = () => {
      snackbar.closeSnackbar(lastSnack)
    }
    for await (const res of iterator) {
      closeLast()
      const variant = getStatusFromVerifyIdentityResult(res)
      lastSnack = snackbar.enqueueSnackbar(res.message, {
        variant,
        autoHideDuration: 20000,
        onClick: closeLast,
        style: {
          cursor: 'pointer'
        }
      })
      if (variant !== 'info') {
        break
      }
    }
    resetProfile()
  }

  return (
    <>
      {profile.identityVerified?.status === 'Rejected' && (
        <Alert type="error">
          <h2>Verification Failed</h2>
          <p>
            An admin reviewed your document verification request, which has
            failed with the following reason:
            <br /> <b>&ldquo;{profile.identityVerified?.reason}&rdquo;</b>
            <br /> Please try again.
          </p>
        </Alert>
      )}
      {profile.identityVerified?.status === 'Submitted' && (
        <Alert type="info">
          <h2>Request is submitted</h2>
          <p>
            Our AI could not verify it automatically. We will verify it as soon
            as possible, but you can still try fulfil the needs of the AI.
          </p>
        </Alert>
      )}
      {profile.identityVerified?.status === 'VerifiedByAi' && (
        <Alert type="success">
          <h2>Verification is half way to success</h2>
          <p>
            Our AI could verify your documents, but an admin will review it
            manually as well.
          </p>
        </Alert>
      )}
      {profile.identityVerified?.status === 'VerifiedByAdmin' && (
        <Alert type="success">
          <h2>Verification has been succeeded</h2>
        </Alert>
      )}
      <UploadPhotoContainer>
        <IdentityUpload
          icon={isLight ? 'passportFrontLight' : 'passportFront'}
          description={
            <p>
              Take a picture of your <AllowedDocuments />. Avoid glare and make
              sure all 4 corners are visible.
            </p>
          }
          onSelectFile={async (file) => {
            const iterator = kycService.uploadIdentityPhoto({
              body: {
                file: await blobToBase64(file)
              }
            })

            for await (const res of iterator) {
              setUploadIdentityPhotoResult(res)
            }
          }}
          result={
            uploadIdentityPhotoResult
              ? {
                  message: uploadIdentityPhotoResult.message,
                  status: getStatusFromUploadIdentityPhotoResult(
                    uploadIdentityPhotoResult
                  )
                }
              : null
          }
        />
        <IdentityUpload
          icon={isLight ? 'passportHoldLight' : 'passportHold'}
          description={
            <p>
              Take a picture of you holding your <AllowedDocuments /> near your
              face so we can verify your identity.
            </p>
          }
          onSelectFile={async (file) => {
            const iterator = kycService.uploadUserWithIdentityPhoto({
              body: {
                file: await blobToBase64(file)
              }
            })

            for await (const res of iterator) {
              setuploadUserWithIdentityPhotoResult(res)
            }
          }}
          result={
            uploadUserWithIdentityPhotoResult
              ? {
                  message: uploadUserWithIdentityPhotoResult.message,
                  status: getStatusFromUploadIdentityPhotoResult(
                    uploadUserWithIdentityPhotoResult
                  )
                }
              : null
          }
        />
      </UploadPhotoContainer>
      <Separator />
      <DashboardForm.Form onSubmit={handleSubmit(onSubmit)}>
        <DashboardForm.InputGroup>
          <InputField
            error={!!formState.errors.firstName}
            inputProps={{
              placeholder: 'First name',
              ...register('firstName')
            }}
          />
          <InputField
            error={!!formState.errors.lastName}
            inputProps={{ placeholder: 'Last name', ...register('lastName') }}
          />
          <Controller
            control={control}
            name="birthday"
            rules={{
              required: true,
              validate: (value) => !isNaN(new Date(value).getFullYear())
            }}
            render={({ field, fieldState }) => {
              return (
                <DateInput
                  error={!!fieldState.error}
                  inputProps={{
                    ...field,
                    placeholder: 'Birthday'
                  }}
                />
              )
            }}
          />
          <Button
            type="submit"
            variant="large"
            disabled={
              !uploadIdentityPhotoResult || !uploadUserWithIdentityPhotoResult
            }>
            Verify
          </Button>
        </DashboardForm.InputGroup>
      </DashboardForm.Form>
    </>
  )
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as unknown as string)
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(blob)
  })
}

function getStatusFromUploadIdentityPhotoResult(
  result: UploadIdentityPhoto.Response
) {
  switch (result.result) {
    case 'unexpected-error':
    case 'validation-error':
    case 'qualityVerificationFailed':
      return 'error'
    case 'verifyingQuality':
    case 'saving':
      return 'loading'
    case 'success':
      return 'success'
  }
}
function getStatusFromVerifyIdentityResult(result: VerifyIdentity.Response) {
  switch (result.result) {
    case 'facesDidNotMatch':
    case 'unableToFindRequiredTextOnPhoto':
      return 'warning'
    case 'missingRequiredPhotos':
      return 'error'
    case 'success':
      return 'success'
    default:
      return 'info'
  }
}

const UploadPhotoContainer = styled.div({
  display: 'flex',
  flexFlow: 'row',
  justifyContent: 'center',
  gap: '2em 0',
  flexWrap: 'wrap'
})

const Separator = styled.hr((props) => ({
  width: '354px',
  border: `1px solid ${props.theme.palette.border.light}`,
  margin: '32px 0'
}))

const AllowedDocuments = () => (
  <span>
    <b>National ID</b> / <b>Passport</b> / <b>Driving license</b>
  </span>
)
