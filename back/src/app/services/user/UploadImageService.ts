import { AWS_CONFIG, bucketName } from 'app/config/config'
import * as AWS from 'aws-sdk'
import * as fs from 'fs'
export class UploadImageService {
  private s3: AWS.S3
  constructor() {
    this.s3 = new AWS.S3(AWS_CONFIG())
  }
  async upload(file: Express.Multer.File) {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename
    }
    return this.s3.upload(uploadParams).promise()
  }
}
