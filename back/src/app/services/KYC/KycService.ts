/* eslint-disable sonarjs/prefer-single-boolean-return */
import { FaceVerificationService } from './FaceVerificationService'
import sharp from 'sharp'
import { TextVerificationService } from './TextVerficationService'
import { User } from 'app/models/user.model'
import {
  IDENTITY_PHOTO_FACE_KEY,
  IDENTITY_PHOTO_KEY,
  KycEntry,
  USER_WITH_IDENTITY_PHOTO_FACE_KEY,
  USER_WITH_IDENTITY_PHOTO_KEY
} from 'app/models/kycEntry.model'
import { VerificationSubject } from 'shared/endpoints/kycAdmin'
import { Base64File, FileService, ImageService } from '../FileService'
import { CreationAttributes } from 'sequelize/types'

export class KycService {
  constructor(
    private __faceVerificationService: FaceVerificationService,
    private __textVerificationService: TextVerificationService,
    private __fileService: FileService,
    private __userRepository: typeof User,
    private __kycEntriesRespository: typeof KycEntry,
    private __imageService: ImageService
  ) {}

  async *uploadIdentityPhoto(
    email: string,
    documentType: string,
    image: Base64File
  ) {
    yield { status: 'saving' as const }
    image = await this.__imageService.convertToJpeg(image)
    const user = await this.__getUser(email)
    await this.__fileService.put(
      IDENTITY_PHOTO_KEY(user.id, documentType),
      image
    )

    yield { status: 'verifyingQuality' as const }
    const imageBuffer = image.getBinaryBuffer()
    const verifyQualityResult =
      await this.__faceVerificationService.verifyFaceQuality(imageBuffer, {
        minFaces: 1,
        maxFaces: 2
      })

    if (verifyQualityResult.result === 'success') {
      const biggestFace = verifyQualityResult.faces[0]
      const croppedFace = await this.__getCroppedImageToFace(
        imageBuffer,
        biggestFace.boundingBox
      )
      // NOTE: UPLOADING a cropped face should be only done after a successful prevalidation
      // as [verifyIdentity] depends on this behaviour
      await this.__fileService.put(
        IDENTITY_PHOTO_FACE_KEY(user.id, documentType),
        croppedFace
      )
      yield { status: 'success' as const }
    } else {
      yield {
        status: 'qualityVerificationFailed' as const,
        verificationDetails: verifyQualityResult
      }
    }
  }

  async *uploadUserWithIdentityPhoto(
    email: string,
    documentType: string,
    image: Base64File
  ) {
    yield { status: 'saving' as const }
    image = await this.__imageService.convertToJpeg(image)
    const user = await this.__getUser(email)
    await this.__fileService.put(
      USER_WITH_IDENTITY_PHOTO_KEY(user.id, documentType),
      image
    )

    yield { status: 'verifyingQuality' as const }
    const imageBuffer = image.getBinaryBuffer()
    const verifyQualityResult =
      await this.__faceVerificationService.verifyFaceQuality(imageBuffer, {
        minFaces: 2,
        maxFaces: 3
      })

    if (verifyQualityResult.result === 'success') {
      const croppedFaces = await Promise.all(
        verifyQualityResult.faces.map((face) => {
          return this.__getCroppedImageToFace(imageBuffer, face.boundingBox)
        })
      )
      // NOTE: UPLOADING a cropped face should be only done after a successful prevalidation
      // as [verifyIdentity] depends on this behaviour
      await Promise.all(
        croppedFaces.map((croppedFace, key) => {
          this.__fileService.put(
            USER_WITH_IDENTITY_PHOTO_FACE_KEY(user.id, documentType, key + 1),
            croppedFace
          )
        })
      )

      yield { status: 'success' as const }
    } else {
      yield {
        status: 'qualityVerificationFailed' as const,
        verificationDetails: verifyQualityResult
      }
    }
  }

  /**
   * Note: If [uploadUserWithIdentityPhoto] or [uploadIdentityPhoto] has failed it means
   * they did not upload the cropped face to S3. So this will fail also.
   *
   * Later when the speed matters, compareFaces can work with s3 too
   */
  async *verifyIdentity(
    email: string,
    documentType: string,
    dataToVerify: IdentityData
  ) {
    const user = await this.__getUser(email)

    yield { status: 'fetchingPhotos' as const }
    let identityPhoto,
      identityFacePhoto,
      userWithIdentityPhoto1,
      userWithIdentityPhoto2
    try {
      identityPhoto = (
        await this.__fileService.get(IDENTITY_PHOTO_KEY(user.id, documentType))
      ).getBinaryBuffer()
      identityFacePhoto = (
        await this.__fileService.get(
          IDENTITY_PHOTO_FACE_KEY(user.id, documentType)
        )
      ).getBinaryBuffer()
      userWithIdentityPhoto1 = (
        await this.__fileService.get(
          USER_WITH_IDENTITY_PHOTO_FACE_KEY(user.id, documentType, 1)
        )
      ).getBinaryBuffer()
      userWithIdentityPhoto2 = (
        await this.__fileService.get(
          USER_WITH_IDENTITY_PHOTO_FACE_KEY(user.id, documentType, 2)
        )
      ).getBinaryBuffer()
    } catch (e) {
      yield { status: 'missingRequiredPhotos' as const }
      return
    }

    yield { status: 'saving' as const }
    await this.__saveIdentityData(user.id, dataToVerify)
    await this.__setVerificationStatus(user.id, { status: 'Submitted' })
    await this.__updateOrCreateKycEntry({
      documentType,
      verificationSubject: VerificationSubject.Identity,
      userId: user.id
    })

    yield { status: 'matchingFaces' as const }
    const comparison1 = await this.__faceVerificationService.compareFaces(
      identityFacePhoto,
      userWithIdentityPhoto1
    )
    const comparison2 = await this.__faceVerificationService.compareFaces(
      identityFacePhoto,
      userWithIdentityPhoto2
    )
    const comparison3 = await this.__faceVerificationService.compareFaces(
      userWithIdentityPhoto1,
      userWithIdentityPhoto2
    )

    if (
      comparison1.result === 'facesDidNotMatch' ||
      comparison2.result === 'facesDidNotMatch' ||
      comparison3.result === 'facesDidNotMatch'
    ) {
      yield { status: 'facesDidNotMatch' as const }
      return
    }

    yield { status: 'matchingText' as const }

    const areWordsExisting = await this.__areWordsExisting(
      identityPhoto,
      dataToVerify
    )
    if (!areWordsExisting) {
      yield { status: 'unableToFindRequiredTextOnPhoto' as const }
      return
    }

    await this.__setVerificationStatus(user.id, { status: 'VerifiedByAi' })
    yield { status: 'success' as const }
  }

  private async __areWordsExisting(
    identityPhotoBin: Buffer,
    dataToVerify: IdentityData
  ) {
    // Read document
    const detection = await this.__textVerificationService.getTexts(
      identityPhotoBin
    )

    // Pre-format data
    const firstNameParts = dataToVerify.firstName.split(' ')
    const lastNameParts = dataToVerify.lastName.split(' ')
    const year = dataToVerify.birthday.getFullYear().toString()
    const month = (dataToVerify.birthday.getMonth() + 1).toString()
    const monthPadded = month.padStart(2, '0')
    const date = dataToVerify.birthday.getDate().toString()
    const datePadded = date.padStart(2, '0')

    // Logic
    const isMonthExisting =
      detection.isExisting(month) || detection.isExisting(monthPadded)
    const isDateExisting =
      detection.isExisting(date) || detection.isExisting(datePadded)
    return (
      detection.areExisting(firstNameParts) &&
      detection.areExisting(lastNameParts) &&
      detection.isExisting(year) &&
      isMonthExisting &&
      isDateExisting
    )
  }

  private async __updateOrCreateKycEntry(data: CreationAttributes<KycEntry>) {
    const query = {
      where: {
        userId: data.userId,
        documentType: data.documentType,
        verificationSubject: data.verificationSubject
      }
    }
    const found = await this.__kycEntriesRespository.findOne(query)
    if (!found) {
      await this.__kycEntriesRespository.create(data)
    } else {
      await this.__kycEntriesRespository.update(data, query)
    }
  }

  private async __getUser(email: string) {
    const user = await this.__userRepository.findOne({
      where: {
        email
      }
    })
    if (!user) throw new Error('User is not found')
    return user
  }

  /**
   * @param mime e.g.: image/jpeg
   */
  private async __getCroppedImageToFace(
    imageBlob: Buffer,
    boundingBox: { x: number; y: number; width: number; height: number }
  ) {
    const image = await sharp(imageBlob)
    const croppedImage = await image
      .rotate()
      .extract({
        left: boundingBox.x,
        top: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height
      })
      .png()
      .toBuffer()
    return new Base64File('image/png', croppedImage.toString('base64'))
  }

  private async __setVerificationStatus(
    userId: number,
    verified: User['identityVerified']
  ) {
    await this.__userRepository.update(
      {
        identityVerified: verified
      },
      {
        where: {
          id: userId
        }
      }
    )
  }

  private async __saveIdentityData(userId: number, data: IdentityData) {
    await this.__userRepository.update(
      {
        birthday: data.birthday.toISOString().split('T')[0],
        firstName: data.firstName,
        lastName: data.lastName
      },
      {
        where: {
          id: userId
        }
      }
    )
  }
}

interface IdentityData {
  birthday: Date
  firstName: string
  lastName: string
}