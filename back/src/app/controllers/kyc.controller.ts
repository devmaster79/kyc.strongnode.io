import { Rekognition } from '@aws-sdk/client-rekognition'
import { S3 } from '@aws-sdk/client-s3'
import { AWS_REKOGNITION_CONFIG, AWS_S3_CONFIG } from 'app/config/config'
import {
  KycEntry as kycEntryRepository,
  User as userRepository
} from 'app/models'
import {} from 'app/models/user.model'
import { Base64File, FileService, ImageService } from 'app/services/FileService'
import { FaceVerificationService } from 'app/services/KYC/FaceVerificationService'
import { KycService } from 'app/services/KYC/KycService'
import { TextVerificationService } from 'app/services/KYC/TextVerficationService'
import {
  UploadIdentityPhoto,
  UploadUserWithIdentityPhoto,
  VerifyIdentity
} from 'shared/endpoints/kyc'
import { withSseResponse } from './utils'

const rekognition = new Rekognition(AWS_REKOGNITION_CONFIG())
const kycService = new KycService(
  new FaceVerificationService(rekognition),
  new TextVerificationService(rekognition),
  new FileService(new S3(AWS_S3_CONFIG)),
  userRepository,
  kycEntryRepository,
  new ImageService()
)

export const uploadIdentityPhoto =
  withSseResponse<UploadIdentityPhoto.Response>(async function* (req) {
    const data = UploadIdentityPhoto.schema.parse(req.body)
    const file = Base64File.fromDataURI(data.file)

    const uploadImageResults = kycService.uploadIdentityPhoto(
      req.user.email,
      'passport',
      file
    )

    for await (const uploadImageResult of uploadImageResults) {
      const result = __getUploadCardResponses(uploadImageResult)
      yield result
      if (result.result === 'qualityVerificationFailed') {
        // end the iterator
        return
      }
    }
  })

export const uploadImageOfUserHoldingHisDocument =
  withSseResponse<UploadUserWithIdentityPhoto.Response>(async function* (req) {
    const data = UploadIdentityPhoto.schema.parse(req.body)
    const file = Base64File.fromDataURI(data.file)

    const uploadImageResults = kycService.uploadUserWithIdentityPhoto(
      req.user.email,
      'passport',
      file
    )

    for await (const uploadImageResult of uploadImageResults) {
      const result = __getUploadCardResponses(uploadImageResult)
      yield result
      if (result.result === 'qualityVerificationFailed') {
        // end the iterator
        return
      }
    }
  })

export const verifyIdentity = withSseResponse<VerifyIdentity.Response>(
  async function* (req) {
    const data = VerifyIdentity.schema.parse(req.body)
    const verificationResults = kycService.verifyIdentity(
      req.user.email,
      'passport',
      {
        birthday: new Date(data.birthday),
        firstName: data.firstName,
        lastName: data.lastName
      }
    )

    for await (const verificationResult of verificationResults) {
      const response = __getVerifyIdentityResponses(verificationResult)
      yield {
        result: 'success',
        ...response
      }
    }
  }
)

type Yielded<T> = T extends AsyncGenerator<infer R, unknown, unknown> ? R : T

function __getVerifyIdentityResponses(
  verificationResult: Yielded<ReturnType<typeof kycService.verifyIdentity>>
) {
  const failMessage = (reason: string) => `
    Verification failed. ${reason}
    If you want to try again, you can, but an administrator will review it anyways.
  `
  const results = {
    facesDidNotMatch: {
      verificationResult: 'warning',
      message: failMessage('Faces did not match')
    },
    badPhotos: {
      verificationResult: 'warning',
      message: failMessage('The uploaded photos had problems.')
    },
    duplicateFound: {
      verificationResult: 'warning',
      message: failMessage('Duplicate registration found.')
    },
    unableToFindRequiredTextOnPhoto: {
      verificationResult: 'warning',
      message: failMessage('Unable to find the required text on photo')
    },
    matchingFaces: {
      verificationResult: 'info',
      message: 'Matching the faces between the provided photos'
    },
    matchingText: {
      verificationResult: 'info',
      message: 'Verfying text on the ID card'
    },
    verifying: {
      verificationResult: 'info',
      message: 'Verfying'
    },
    fetchingPhotos: {
      verificationResult: 'info',
      message: 'Loading photos'
    },
    missingRequiredPhotos: {
      verificationResult: 'error',
      message: 'Please upload the required photos first.'
    },
    saving: {
      verificationResult: 'info',
      message: 'Saving'
    },
    success: {
      verificationResult: 'success',
      message: `
      We could verify your identity, so you can access more features,
      but you will be still limited until we verify it manually.
      We will review it as soon as possible.
    `
    }
  } as Record<
    typeof verificationResult.status,
    {
      verificationResult: 'warning' | 'error' | 'info' | 'success'
      message: string
    }
  >
  return results[verificationResult.status]
}

function __getUploadCardResponses(
  uploadImageResult: Yielded<ReturnType<typeof kycService.uploadIdentityPhoto>>
) {
  const baseResponse = { result: uploadImageResult.status }
  const messages = {
    verifyingQuality: 'We are currently verifying the image.',
    saving: 'Saving the image.',
    qualityVerificationFailed: (reason: string) => `
      Verification failed. ${reason}
      If you want to try again, you can, but an administrator will review it anyways.
    `,
    success: 'Perfect!'
  }
  switch (uploadImageResult.status) {
    case 'success':
    case 'verifyingQuality':
    case 'saving':
      return {
        ...baseResponse,
        message: messages[uploadImageResult.status]
      }
    case 'qualityVerificationFailed':
      return {
        ...baseResponse,
        message: messages.qualityVerificationFailed(
          __getQualityVerificationFailDetails(
            uploadImageResult.verificationDetails
          )
        )
      }
  }
}

function __getQualityVerificationFailDetails(
  details: Exclude<
    Yielded<
      ReturnType<typeof kycService.uploadIdentityPhoto>
    >['verificationDetails'],
    undefined
  >
) {
  const failDetailMessages = {
    facesAreNotLargeEnough: 'Faces are not large enough.',
    notEnoughFaces: (numberOfFaces: number) =>
      `Not enough faces. (faces: ${numberOfFaces})`,
    notEnoughWellDefinedFaces: (numberOfFaces: number) =>
      `Not enough well defined faces. (faces: ${numberOfFaces})`,
    tooMuchFaces: (numberOfFaces: number) =>
      `Too much faces (faces: ${numberOfFaces})`,
    faceIsNotStraightEnough: (nthLargestFace: number, help: string) =>
      `The ${nthLargestFace}. largest face is not straight enough. ${help}`
  }
  const straighteningMessages = {
    tooUp: `You look too up.`,
    tooDown: `You look too down.`,
    tooTilted: `You tilt your head.`,
    tooLeft: `You look too left.`,
    tooRight: `You look too right.`
  }

  switch (details.result) {
    case 'facesAreNotLargeEnough':
      return failDetailMessages.facesAreNotLargeEnough
    case 'notEnoughFaces':
    case 'notEnoughWellDefinedFaces':
    case 'tooMuchFaces':
      return failDetailMessages[details.result](details.numberOfFaces)
    case 'faceIsNotStraightEnough':
      return failDetailMessages.faceIsNotStraightEnough(
        details.nthLargest,
        straighteningMessages[details.direction]
      )
  }
}
