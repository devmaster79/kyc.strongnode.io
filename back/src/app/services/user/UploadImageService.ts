import { AWS_BUCKET_NAME, S3_CONFIG } from 'app/config/config'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as fs from 'fs'
export class UploadImageService {
  private s3: S3Client
  constructor() {
    this.s3 = new S3Client(S3_CONFIG)
  }
  async upload(file: Express.Multer.File) {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
      Bucket: AWS_BUCKET_NAME,
      Body: fileStream,
      Key: file.filename
    }
    const command = new PutObjectCommand(uploadParams)
    return new Promise((resolve, reject) => {
      this.s3
        .send(command)
        .then(() => {
          resolve(
            `${process.env.AWS_LOCALSTACK_URL}/${AWS_BUCKET_NAME}/${file.filename}`
          )
        })
        .catch((e) => reject(e))
    })
  }
}
