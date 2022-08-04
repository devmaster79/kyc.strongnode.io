import { S3 } from '@aws-sdk/client-s3'
import { AWS_BUCKET_NAME } from 'app/config/config'
import sharp from 'sharp'
import { Readable } from 'stream'

/**
 * A service that lets us interact with AWS S3 easily
 */
export class FileService {
  constructor(private __s3: S3) {}

  async get(key: string): Promise<Base64File> {
    const image = await this.__s3.getObject({
      Bucket: AWS_BUCKET_NAME,
      Key: key
    })

    return Base64File.fromDataURI(
      await this.__streamToString(image.Body as Readable)
    )
  }

  async put(key: string, file: Base64File) {
    await this.__s3.putObject({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: file.toDataURI()
    })
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

/**
 * Provide image operations on Base64File
 */
export class ImageService {
  constructor(private __sharp: typeof sharp = sharp) {}

  async convertToJpeg(image: Base64File): Promise<Base64File> {
    const convertedImageBuffer = await this.convertToJpegBuffer(image)
    return new Base64File('image/jpeg', convertedImageBuffer.toString('base64'))
  }

  async convertToJpegBuffer(image: Base64File): Promise<Buffer> {
    if (image.mime === 'image/jpeg') return image.getBinaryBuffer()
    const loadedImage = await this.__sharp(image.getBinaryBuffer())
    return await loadedImage
      .withMetadata()
      .jpeg({ quality: 70, force: true })
      .toBuffer()
  }
}

/**
 * This is a model that does nothing else but carrying the data with some accessors
 */
export class Base64File {
  constructor(public mime: string, public content: string) {}

  static fromDataURI(dataURI: string) {
    const file = dataURI.split(';base64,')
    const mime = file[0].replace('data:', '')
    const content = file[1]
    return new Base64File(mime, content)
  }

  clone() {
    return new Base64File(this.mime, this.content)
  }

  getBinaryBuffer() {
    return Buffer.from(this.content, 'base64')
  }

  toDataURI() {
    return `data:${this.mime};base64,${this.content}`
  }
}
