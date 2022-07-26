import {
  Rekognition,
  ResourceAlreadyExistsException
} from '@aws-sdk/client-rekognition'

/**
 * A service that handles the AWS Rekognition collection. This collection is a No-SQL DB that stores the faces.
 * The face collection is used for searching existing faces, so we can avoid duplicated registrations
 * May RekognitionCollectionRepository would be a better name, but we don't use repository pattern in this project.
 */
export class RekognitionCollectionService {
  constructor(private __rekognition: Rekognition) {}

  async getOrCreate(collectionId: string) {
    const createResult = await this.create(collectionId)
    if (createResult.result === 'resource-already-exists') {
      return await this.describe(collectionId)
    }
    return createResult
  }

  async create(collectionId: string) {
    try {
      await this.__rekognition.createCollection({
        CollectionId: collectionId
      })
    } catch (e) {
      if (e instanceof ResourceAlreadyExistsException) {
        return {
          result: 'resource-already-exists' as const
        }
      }
      // for any other error:
      throw e
    }

    const details = await this.describe(collectionId)
    return {
      result: 'success' as const,
      details
    }
  }

  async delete(collectionId: string) {
    await this.__rekognition.deleteCollection({
      CollectionId: collectionId
    })
  }

  async removeFace(collectionId: string, faceId: string) {
    await this.__rekognition.deleteFaces({
      CollectionId: collectionId,
      FaceIds: [faceId]
    })
  }

  async describe(collectionId: string) {
    const response = await this.__rekognition.describeCollection({
      CollectionId: collectionId
    })

    return {
      faceCount: response.FaceCount,
      faceModelVersion: response.FaceModelVersion,
      collectionArn: response.CollectionARN,
      creationTimestamp: response.CreationTimestamp,
      collectionId: collectionId
    }
  }
}
