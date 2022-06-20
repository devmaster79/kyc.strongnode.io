import { Request } from 'express'

const path = require('path')
const multer = require('multer')
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) => {
    cb(null, path.resolve('../uploads/'))
  },
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, `${Date.now()}-strongnode-${file.originalname}`)
  }
})

export const uploadFileMiddleWare = multer({ storage: storage })
