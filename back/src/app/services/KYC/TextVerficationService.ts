import { Rekognition, TextDetection } from '@aws-sdk/client-rekognition'
import removeAccents from 'remove-accents'
import { OldAwsSdkError } from './errors'

export class TextVerificationService {
  constructor(private __rekognition: Rekognition) {}

  async getTexts(idImageBlob: Buffer) {
    const results = await this.__rekognition.detectText({
      Image: {
        Bytes: idImageBlob
      }
    })
    if (!results?.TextDetections) throw new OldAwsSdkError()
    const texts = results.TextDetections.filter((result) => {
      return result.Type === 'WORD'
    })
    return new DetectedTexts(texts)
  }
}

export class DetectedTexts {
  constructor(private __texts: TextDetection[]) {}

  isExisting(word: string) {
    return (
      this.__texts.findIndex((text) => {
        if (!text.DetectedText) throw new OldAwsSdkError()
        return this.__compare_texts(text.DetectedText, word)
      }) !== -1
    )
  }

  areExisting(words: string[]) {
    const numberOfExistingWords = words
      .map((word) => this.isExisting(word))
      .map((x) => x)
      .filter((existence) => existence).length
    return numberOfExistingWords === words.length
  }

  __compare_texts(detected: string, word: string) {
    // Sometimes AWS cannot get the accents so we have to remove them with [normalize].
    // To reduce user errors we need to lowercase the detected text.
    return (
      removeAccents(detected.toLowerCase().normalize()) ===
      removeAccents(word.toLowerCase().normalize())
    )
  }
}
