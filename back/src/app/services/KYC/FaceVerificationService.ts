import { FaceDetail, Rekognition } from '@aws-sdk/client-rekognition'
import sharp from 'sharp'
import { OldAwsSdkError } from './errors'

export class FaceVerificationService {
  constructor(private __rekognition: Rekognition) {}

  /**
   * @returns In case of success the faces will be descending order by size
   * and only minFaces number of faces will be returned
   */
  async verifyFaceQuality(
    faceImageBlob: Buffer,
    options: {
      maxFaces: number
      minFaces: number
    }
  ) {
    const imageSize = await this.__getImageSize(faceImageBlob)
    const detectFacesResponse = await this.__rekognition.detectFaces({
      Image: {
        Bytes: faceImageBlob
      }
    })
    const faceDetails = detectFacesResponse.FaceDetails
    if (!faceDetails) throw new OldAwsSdkError()

    // RESPONSE TYPE 1:
    if (faceDetails.length < options.minFaces) {
      return {
        result: 'notEnoughFaces' as const,
        numberOfFaces: faceDetails.length
      }
    }

    const facesWithGoodConfidence = faceDetails.filter(this.__hasHighConfidence)

    // RESPONSE TYPE 2:
    if (facesWithGoodConfidence.length < options.minFaces) {
      return {
        result: 'notEnoughWellDefinedFaces' as const,
        numberOfFaces: facesWithGoodConfidence.length
      }
    }

    // RESPONSE TYPE 3:
    if (facesWithGoodConfidence.length > options.maxFaces) {
      return {
        result: 'tooMuchFaces' as const,
        numberOfFaces: facesWithGoodConfidence.length
      }
    }

    const bigFaces = facesWithGoodConfidence.filter((face) =>
      this.__islargeEnough(face, imageSize)
    )

    // RESPONSE TYPE 4:
    if (bigFaces.length < options.minFaces) {
      return {
        result: 'facesAreNotLargeEnough' as const,
        numberOfFaces: bigFaces.length
      }
    }

    bigFaces.sort(this.__isOtherFaceLarger)
    const requiredFaces = bigFaces.splice(0, options.minFaces)

    // RESPONSE TYPE 5:
    const straightnessResults = requiredFaces.map(this.__isStraightEnough)
    for (const resultId in straightnessResults) {
      const result = straightnessResults[resultId]
      if (!result.straight) {
        return {
          result: 'faceIsNotStraightEnough' as const,
          nthLargest: parseInt(resultId) + 1,
          direction: result.direction
        }
      }
    }

    return {
      result: 'success' as const,
      faces: requiredFaces.map((face) =>
        this.__getCustomFaceDetail(face, imageSize)
      )
    }
  }

  __islargeEnough(
    face: FaceDetail,
    imageSize: { width: number; height: number }
  ) {
    if (!face.BoundingBox?.Height || !face.BoundingBox?.Width)
      throw new OldAwsSdkError()
    return (
      face.BoundingBox?.Height * imageSize.height >= 50 &&
      face.BoundingBox?.Width * imageSize.width >= 50
    )
  }

  __hasHighConfidence(face: FaceDetail) {
    if (!face.Confidence) throw new OldAwsSdkError()
    return face.Confidence > 0.9
  }

  __isOtherFaceLarger(a: FaceDetail, b: FaceDetail) {
    if (!a.BoundingBox?.Height || !a.BoundingBox?.Width)
      throw new OldAwsSdkError()
    if (!b.BoundingBox?.Height || !b.BoundingBox?.Width)
      throw new OldAwsSdkError()
    const a_area = a.BoundingBox?.Height * a.BoundingBox?.Width
    const b_area = b.BoundingBox?.Height * b.BoundingBox?.Width
    return a_area < b_area ? 1 : -1
  }

  // May the head is too rotated in some axis
  __isStraightEnough(face: FaceDetail) {
    if (!face.Pose || !face.Pose.Roll || !face.Pose.Yaw || !face.Pose.Pitch)
      throw new OldAwsSdkError()

    let direction = null
    if (Math.abs(face.Pose.Roll) > 10) direction = 'tooTilted' as const
    if (face.Pose.Yaw > 10) direction = 'tooRight' as const
    if (face.Pose.Yaw < -10) direction = 'tooLeft' as const
    if (face.Pose.Pitch > 10) direction = 'tooUp' as const
    if (face.Pose.Pitch < -10) direction = 'tooDown' as const
    if (direction !== null) {
      return {
        straight: false as const,
        direction
      }
    }
    return { straight: true as const }
  }

  /** Extract the face info that might be interesting for other services */
  __getCustomFaceDetail(
    face: FaceDetail,
    imageSize: { width: number; height: number }
  ) {
    if (
      !face.BoundingBox?.Height ||
      !face.BoundingBox?.Width ||
      !face.BoundingBox.Left ||
      !face.BoundingBox.Top
    )
      throw new OldAwsSdkError()
    return {
      boundingBox: {
        x: Math.floor(face.BoundingBox.Left * imageSize.width),
        y: Math.floor(face.BoundingBox.Top * imageSize.height),
        width: Math.floor(face.BoundingBox.Width * imageSize.width),
        height: Math.floor(face.BoundingBox.Height * imageSize.height)
      }
    }
  }

  async __getImageSize(imageBuffer: Buffer) {
    const image = await sharp(imageBuffer).metadata()
    if (!image.width || !image.height) throw new Error('bad sharp response')

    // 1= 0 degrees: the correct orientation, no adjustment is required.
    // 2= 0 degrees, mirrored: image has been flipped back-to-front.
    // 3= 180 degrees: image is upside down.
    // 4= 180 degrees, mirrored: image has been flipped back-to-front and is upside down.
    // 5= 90 degrees: image has been flipped back-to-front and is on its side.
    // 6= 90 degrees, mirrored: image is on its side.
    // 7= 270 degrees: image has been flipped back-to-front and is on its far side.
    // 8= 270 degrees, mirrored: image is on its far side.
    if (image.orientation && [5, 6, 7, 8].includes(image.orientation))
      return {
        width: image.height,
        height: image.width
      }
    else {
      return {
        width: image.width,
        height: image.height
      }
    }
  }

  async checkDuplicate(collectionId: string, faceImageBlob: Buffer) {
    const searchFacesResponse = await this.__rekognition.searchFacesByImage({
      CollectionId: collectionId,
      FaceMatchThreshold: 95,
      Image: {
        Bytes: faceImageBlob
      }
    })

    if (!searchFacesResponse || !searchFacesResponse.FaceMatches) {
      throw new OldAwsSdkError()
    }

    if (searchFacesResponse.FaceMatches.length < 1) {
      return { result: 'success' as const }
    }

    return { result: 'duplicateFound' as const }
  }

  async compareFaces(faceImageBlob: Buffer, idImageBlob: Buffer) {
    const compareFacesResponse = await this.__rekognition.compareFaces({
      SimilarityThreshold: 90,
      SourceImage: {
        Bytes: faceImageBlob
      },
      TargetImage: {
        Bytes: idImageBlob
      }
    })

    if (!compareFacesResponse || !compareFacesResponse.FaceMatches) {
      throw new OldAwsSdkError()
    }

    if (compareFacesResponse.FaceMatches.length == 1) {
      return { result: 'success' as const }
    }

    return { result: 'facesDidNotMatch' as const }
  }

  /**
   * Save the face into the collection
   */
  async indexFace(collectionId: string, userId: number, faceImageBlob: Buffer) {
    const indexFaceResponse = await this.__rekognition.indexFaces({
      CollectionId: collectionId,
      DetectionAttributes: [],
      ExternalImageId: userId.toString(),
      Image: {
        Bytes: faceImageBlob
      }
    })
    if (
      !indexFaceResponse ||
      !indexFaceResponse.FaceRecords ||
      !indexFaceResponse.FaceRecords[0] ||
      !indexFaceResponse.FaceRecords[0].Face ||
      !indexFaceResponse.FaceRecords[0].Face.FaceId
    ) {
      throw new OldAwsSdkError()
    } else {
      return {
        result: 'success' as const,
        faceId: indexFaceResponse.FaceRecords[0].Face.FaceId
      }
    }
  }
}

export type CustomFaceDetail = ReturnType<
  FaceVerificationService['__getCustomFaceDetail']
>
