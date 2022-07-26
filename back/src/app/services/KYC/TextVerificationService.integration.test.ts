import { describe, it } from 'mocha'
import assert from 'assert'
import { TextVerificationService } from './TextVerficationService'
import { Rekognition } from '@aws-sdk/client-rekognition'
import { AWS_REKOGNITION_CONFIG } from 'app/config/config'
import { readFileSync } from 'fs'
import path from 'path'

let runTest = true
beforeEach(function () {
  const wrongEnvironment = process.env.AWS_ACCESS_KEY_ID === 'localhost'
  if (wrongEnvironment) {
    runTest = false
  }
})

describe('TextVerificationService integration test', () => {
  if (runTest) {
    let service: TextVerificationService
    before(() => {
      service = new TextVerificationService(
        new Rekognition(AWS_REKOGNITION_CONFIG)
      )
    })

    it('should pass existence check of words when the data is right', async () => {
      const detection = await service.getTexts(
        readFileSync(path.join(__dirname, './assets/example-id-card.jpg'), null)
      )
      assert.ok(detection.isExisting('SZÉPENÉ'))
      assert.ok(detection.isExisting('KISS'))
      assert.ok(detection.isExisting('ROZÁLIA'))
    }).timeout(0)
    it('should fail existence check of words when the data is wrong', async () => {
      const detection = await service.getTexts(
        readFileSync(path.join(__dirname, './assets/example-id-card.jpg'), null)
      )
      assert.ok(!detection.isExisting('kEEp'))
      assert.ok(!detection.isExisting('SMILING'))
    }).timeout(0)
  }
})
