import { AWS_BUCKET_NAME, AWS_S3_CONFIG } from 'app/config/config'
import { S3 } from '@aws-sdk/client-s3'
import { UserRequest } from 'app/controllers/utils'

const multer = require('multer')
const multerS3 = require('multer-s3')

export const s3Service = new S3(AWS_S3_CONFIG)

type FileNameCallback = (error: Error | null, filename: string) => void

export const uploadFileMiddleWare = multer({
  storage: multerS3({
    s3: s3Service,
    acl: 'public-read',
    bucket: AWS_BUCKET_NAME,
    key: (
      req: UserRequest,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) => {
      cb(
        null,
        `${req.user.email}-${Date.now()}-strongnode-${file.originalname}`
      )
    }
  })
})
