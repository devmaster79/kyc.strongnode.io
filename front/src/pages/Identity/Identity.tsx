import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import Modal from '@ui/Modal/Modal'
import { useAnimated } from '@ui/utils/useAnimated'
import { useState } from 'react'
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

export default function Identity() {
  const [showModal, setShowModal] = useState(true)
  const showModalAnim = useAnimated(showModal, 500)
  const [uploadIdentityPhotoResult, setUploadIdentityPhotoResult] =
    useState<UploadIdentityPhoto.Response | null>(null)
  const [
    uploadUserWithIdentityPhotoResult,
    setuploadUserWithIdentityPhotoResult
  ] = useState<UploadUserWithIdentityPhoto.Response | null>(null)
  const [birthday, setBirthday] = useState(
    `${new Date().getFullYear() - 50}-01-01`
  )
  const snackbar = useSnackbar()

  const { themeMode } = useSettings()
  const isLight = themeMode === 'light'

  return (
    <>
      <Modal
        anim={showModalAnim}
        title="Identity verification"
        icon="identityPassport"
        onClose={() => setShowModal(false)}
        footer={
          <>
            <Button
              type="button"
              variant="large"
              onClick={async () => {
                const date = new Date(birthday)
                const iterator = kycService.verifyIdentity({
                  body: {
                    birthday: {
                      year: date.getFullYear(),
                      month: date.getMonth() + 1,
                      date: date.getDate()
                    }
                  }
                })
                let lastSnack: SnackbarKey | undefined = undefined
                const closeLast = () => {
                  snackbar.closeSnackbar(lastSnack)
                }
                for await (const res of iterator) {
                  closeLast()
                  lastSnack = snackbar.enqueueSnackbar(res.message, {
                    variant: getStatusFromVerifyIdentityResult(res),
                    autoHideDuration: 20000,
                    onClick: closeLast,
                    style: {
                      cursor: 'pointer'
                    }
                  })
                }
              }}>
              Continue
            </Button>
          </>
        }
        scrollable>
        <IdentityUpload
          icon={isLight ? 'passportFrontLight' : 'passportFront'}
          description="Take picture of your national ID / Passport / Driving license.
          Avoid glare and make sure all 4 corners are visible."
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
        <Separator />
        <IdentityUpload
          icon={isLight ? 'passportHoldLight' : 'passportHold'}
          description="Take a picture of you holding your national ID / Passport / Driving license
            near your face so we can verify your identity."
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
        <Separator />
        <BirthdayInputWrapper>
          <InputField
            inputProps={{
              placeholder: 'Birthday',
              type: 'text',
              id: 'birthday',
              value: birthday,
              pattern: 'd{4}-d{2}-d{2}',
              onChange: (event) => setBirthday(event.target.value),
              min: `${new Date().getFullYear() - 100}-01-01`,
              max: `${new Date().getFullYear() - 18}-01-01`
            }}
          />
        </BirthdayInputWrapper>
      </Modal>
    </>
  )
}

const Separator = styled.hr((props) => ({
  width: '354px',
  border: `1px solid ${props.theme.palette.border.light}`,
  margin: '32px 0'
}))

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

const BirthdayInputWrapper = styled.div({
  display: 'flex',
  gap: '1em'
})
