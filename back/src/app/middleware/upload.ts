import { Request } from 'express'
import { AWS_BUCKET_NAME, s3Service } from 'app/config/config'

const multer = require('multer')
const multerS3 = require('multer-s3')

type FileNameCallback = (error: Error | null, filename: string) => void

export const uploadFileMiddleWare = multer({
  storage: multerS3({
    s3: s3Service,
    acl: 'public-read',
    bucket: AWS_BUCKET_NAME,
    key: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
      cb(null, `${Date.now()}-strongnode-${file.originalname}`)
    }
  })
})
