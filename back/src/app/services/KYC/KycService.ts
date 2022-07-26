/* eslint-disable sonarjs/prefer-single-boolean-return */
import { FaceVerificationService } from './FaceVerificationService'
import sharp from 'sharp'
import { S3 } from '@aws-sdk/client-s3'
import { AWS_BUCKET_NAME } from 'app/config/config'
import { Base64File } from '../FileUtils'
import { OldAwsSdkError } from './errors'
import { TextVerificationService } from './TextVerficationService'
import { User, VerificationStatus } from 'app/models/user.model'
import { KycEntry, VerificationSubject } from 'app/models/kycEntry.model'
import { Readable } from 'stream'

/** AWS S3 key. The whole photo */
export const IDENTITY_PHOTO_KEY = (userId: number, documentType: string) =>
  `${userId}_${documentType}`
/** AWS S3 key. Only the face from the photo */
export const IDENTITY_PHOTO_FACE_KEY = (userId: number, documentType: string) =>
  `${userId}_${documentType}_face`
/** AWS S3 key. The whole photo */
export const USER_WITH_IDENTITY_PHOTO_KEY = (
  userId: number,
  documentType: string
) => `${userId}_user_with_${documentType}`
/** AWS S3 key. Only the face from the photo */
export const USER_WITH_IDENTITY_PHOTO_FACE_KEY = (
  userId: number,
  documentType: string,
  nth: number
) => `${userId}_user_with_${documentType}_face_${nth}`

export class KycService {
  constructor(
    private __faceVerificationService: FaceVerificationService,
    private __textVerificationService: TextVerificationService,
    private __s3: S3,
    private __userRepository: typeof User,
    private __kycEntriesRespository: typeof KycEntry
  ) {}

  async *uploadIdentityPhoto(
    email: string,
    documentType: string,
    image: Base64File
  ) {
    yield { status: 'saving' as const }
    const user = await this.__getUser(email)
    await this.__s3.putObject({
      Bucket: AWS_BUCKET_NAME,
      Key: IDENTITY_PHOTO_KEY(user.id, documentType),
      Body: image.toDataURI()
    })

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
      await this.__s3.putObject({
        Bucket: AWS_BUCKET_NAME,
        Key: IDENTITY_PHOTO_FACE_KEY(user.id, documentType),
        Body: croppedFace.toDataURI()
      })
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
    const user = await this.__getUser(email)
    await this.__s3.putObject({
      Bucket: AWS_BUCKET_NAME,
      Key: USER_WITH_IDENTITY_PHOTO_KEY(user.id, documentType),
      Body: image.toDataURI()
    })

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
      await Promise.all(
        croppedFaces.map((croppedFace, key) => {
          this.__s3.putObject({
            Bucket: AWS_BUCKET_NAME,
            Key: USER_WITH_IDENTITY_PHOTO_FACE_KEY(
              user.id,
              documentType,
              key + 1
            ),
            Body: croppedFace.toDataURI()
          })
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

  /** Later when the speed matters, compareFaces can work with s3 too */
  async *verifyIdentity(email: string, documentType: string, birthday: Date) {
    const user = await this.__getUser(email)
    yield { status: 'fetchingPhotos' as const }
    let identityPhoto,
      identityFacePhoto,
      userWithIdentityPhoto1,
      userWithIdentityPhoto2
    try {
      identityPhoto = await this.__s3.getObject({
        Bucket: AWS_BUCKET_NAME,
        Key: IDENTITY_PHOTO_KEY(user.id, documentType)
      })
      identityFacePhoto = await this.__s3.getObject({
        Bucket: AWS_BUCKET_NAME,
        Key: IDENTITY_PHOTO_FACE_KEY(user.id, documentType)
      })
      userWithIdentityPhoto1 = await this.__s3.getObject({
        Bucket: AWS_BUCKET_NAME,
        Key: USER_WITH_IDENTITY_PHOTO_FACE_KEY(user.id, documentType, 1)
      })
      userWithIdentityPhoto2 = await this.__s3.getObject({
        Bucket: AWS_BUCKET_NAME,
        Key: USER_WITH_IDENTITY_PHOTO_FACE_KEY(user.id, documentType, 2)
      })
    } catch (e) {
      yield { status: 'missingRequiredPhotos' as const }
      return
    }
    yield { status: 'saving' as const }
    await this.__userRepository.update(
      {
        birthday: birthday.toISOString().split('T')[0]
      },
      {
        where: {
          id: user.id
        }
      }
    )

    yield { status: 'matchingFaces' as const }

    if (
      !identityPhoto.Body ||
      !identityFacePhoto.Body ||
      !userWithIdentityPhoto1.Body ||
      !userWithIdentityPhoto2.Body
    )
      throw new OldAwsSdkError()
    const identityFacePhotoBin = Base64File.fromDataURI(
      await this.__streamToString(identityFacePhoto.Body as Readable)
    ).getBinaryBuffer()
    const userWithIdentityPhoto1Bin = Base64File.fromDataURI(
      await this.__streamToString(userWithIdentityPhoto1.Body as Readable)
    ).getBinaryBuffer()
    const userWithIdentityPhoto2Bin = Base64File.fromDataURI(
      await this.__streamToString(userWithIdentityPhoto2.Body as Readable)
    ).getBinaryBuffer()

    const comparison1 = await this.__faceVerificationService.compareFaces(
      identityFacePhotoBin,
      userWithIdentityPhoto1Bin
    )
    const comparison2 = await this.__faceVerificationService.compareFaces(
      identityFacePhotoBin,
      userWithIdentityPhoto2Bin
    )
    const comparison3 = await this.__faceVerificationService.compareFaces(
      userWithIdentityPhoto1Bin,
      userWithIdentityPhoto2Bin
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
    const identityPhotoBin = Base64File.fromDataURI(
      await this.__streamToString(identityPhoto.Body as Readable)
    ).getBinaryBuffer()

    const wordsAreFound = await this.__areWordsExisting(
      identityPhotoBin,
      user,
      birthday
    )
    if (!wordsAreFound) {
      yield { status: 'unableToFindRequiredTextOnPhoto' as const }
      return
    }

    await this.__kycEntriesRespository.create({
      documentType,
      verificationSubject: VerificationSubject.Identity,
      userId: user.id
    })
    await this.__userRepository.update(
      {
        identityVerified: VerificationStatus.VerifiedByAi
      },
      {
        where: {
          id: user.id
        }
      }
    )
    yield { status: 'success' as const }
  }

  private async __areWordsExisting(
    identityPhotoBin: Buffer,
    user: User,
    birthday: Date
  ) {
    // Read document
    const detection = await this.__textVerificationService.getTexts(
      identityPhotoBin
    )

    // Pre-format data
    const firstNameParts = user.firstName.split(' ')
    const lastNameParts = user.lastName.split(' ')
    const year = birthday.getFullYear().toString()
    const month = (birthday.getMonth() + 1).toString()
    const monthPadded = month.padStart(2, '0')
    const date = birthday.getDate().toString()
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

  async __getUser(email: string) {
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
  async __getCroppedImageToFace(
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

  __streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = []
      stream.on('data', (chunk) => {
        chunks.push(chunk)
      })
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('ascii')))
    })
  }
}
