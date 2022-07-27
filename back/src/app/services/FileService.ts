import { S3 } from '@aws-sdk/client-s3'
import { AWS_BUCKET_NAME } from 'app/config/config'
import { Readable } from 'stream'

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

export class Base64File {
  constructor(public mime: string, public content: string) {}

  static fromDataURI(dataURI: string) {
    const file = dataURI.split(';base64,')
    const mime = file[0].replace('data:', '')
    const content = file[1]
    return new Base64File(mime, content)
  }

  getBinaryBuffer() {
    return Buffer.from(this.content, 'base64')
  }

  toDataURI() {
    return `data:${this.mime};base64,${this.content}`
  }
}
