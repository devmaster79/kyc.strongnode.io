import { AWS_BUCKET_NAME, AWS_REGION } from 'app/config/config'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as fs from 'fs'
export class UploadImageService {
  constructor(private s3: S3Client) {}
  async upload(file: Express.Multer.File): Promise<string> {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
      Bucket: AWS_BUCKET_NAME,
      Body: fileStream,
      Key: file.filename
    }
    const command = new PutObjectCommand(uploadParams)
    await this.s3.send(command)
    if (process.env.NODE_ENV === 'development') {
      return `${process.env.AWS_LOCALSTACK_URL}/${AWS_BUCKET_NAME}/${file.filename}`
    } else {
      return `https://${AWS_BUCKET_NAME}.s3${AWS_REGION}.amazonaws.com/${file.filename}`
    }
  }
}
