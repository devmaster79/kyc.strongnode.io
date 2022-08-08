import { describe, it } from 'mocha'
import assert from 'assert'
import { FaceVerificationService } from './FaceVerificationService'
import { Rekognition } from '@aws-sdk/client-rekognition'
import { AWS_REKOGNITION_CONFIG } from 'app/config/config'
import { readFileSync } from 'fs'
import path from 'path'
import { RekognitionCollectionService } from './RekognitionCollectionService'

const EXAMPLE_USER_ID = 1
const EXAMPLE_COLLECTION_ID = 'face_verification_test'
const EXAMPLE_REKO_SERVICE = new Rekognition(AWS_REKOGNITION_CONFIG)
const EXAMPLE_REKO_COLLECTION_SERVICE = new RekognitionCollectionService(
  EXAMPLE_REKO_SERVICE
)

describe('FaceVerificationService integration test', () => {
  const workingEnvironment =
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID.length > 15
  if (workingEnvironment) {
    beforeEach(async () => {
      await EXAMPLE_REKO_COLLECTION_SERVICE.getOrCreate(EXAMPLE_COLLECTION_ID)
    })

    afterEach(async () => {
      await EXAMPLE_REKO_COLLECTION_SERVICE.delete(EXAMPLE_COLLECTION_ID)
    })

    it('should accept face quality of the example face image', async () => {
      const service = new FaceVerificationService(EXAMPLE_REKO_SERVICE)
      const result = await service.verifyFaceQuality(
        readFileSync(path.join(__dirname, './assets/pseudo-face.png'), null),
        {
          minFaces: 1,
          maxFaces: 2
        }
      )
      assert.equal(result.result, 'success')
    }).timeout(0)

    it('should accept face quality of the example id image', async () => {
      const service = new FaceVerificationService(EXAMPLE_REKO_SERVICE)
      const result = await service.verifyFaceQuality(
        readFileSync(path.join(__dirname, './assets/pseudo-face-id.png'), null),
        {
          minFaces: 1,
          maxFaces: 2
        }
      )
      assert.equal(result.result, 'success')
    }).timeout(0)

    it('should verify that the two faces are the same', async () => {
      const service = new FaceVerificationService(EXAMPLE_REKO_SERVICE)
      const result = await service.compareFaces(
        readFileSync(path.join(__dirname, './assets/pseudo-face.png'), null),
        readFileSync(path.join(__dirname, './assets/pseudo-face-id.png'), null)
      )
      assert.equal(result.result, 'success')
    }).timeout(0)

    it('should be able to save the face', async () => {
      const service = new FaceVerificationService(EXAMPLE_REKO_SERVICE)
      const result = await service.indexFace(
        EXAMPLE_COLLECTION_ID,
        EXAMPLE_USER_ID,
        readFileSync(path.join(__dirname, './assets/pseudo-face.png'), null)
      )
      assert.equal(result.result, 'success')
    }).timeout(0)

    it('should detect duplicated faces when there is any', async () => {
      const service = new FaceVerificationService(EXAMPLE_REKO_SERVICE)
      await service.indexFace(
        EXAMPLE_COLLECTION_ID,
        EXAMPLE_USER_ID,
        readFileSync(path.join(__dirname, './assets/pseudo-face.png'), null)
      )
      const result = await service.findSimilarFaces(
        EXAMPLE_COLLECTION_ID,
        readFileSync(path.join(__dirname, './assets/pseudo-face.png'), null)
      )
      assert.ok(result.length > 0, 'there should be similars')
    }).timeout(0)

    it('should NOT detect duplicated faces when there is NOT any', async () => {
      const service = new FaceVerificationService(EXAMPLE_REKO_SERVICE)
      const result = await service.findSimilarFaces(
        EXAMPLE_COLLECTION_ID,
        readFileSync(path.join(__dirname, './assets/pseudo-face.png'), null)
      )
      assert.equal(result.length, 0, 'there should NOT be similars')
    }).timeout(0)
  }
})
