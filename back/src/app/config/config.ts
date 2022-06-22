import { SESClientConfig } from '@aws-sdk/client-ses'
import { S3ClientConfig } from '@aws-sdk/client-s3'

export const REGISTRATION_LIMIT = 1000

export const EMAIL_CONFIG = {
  source: 'StrongNode Notifications <no-reply@strongnode.io>',
  supportTeamEmail: 'support@strongnode.io'
}

export const SMS_CONFIG = {
  origin: '+18555460621',
  senderId: 'MySenderID',
  registeredKeyword: 'strongnode'
}
export const AWS_REGION = process.env.AWS_REGION || 'us-west-2'

export const AWS_CONFIG = (): SESClientConfig => {
  const options: SESClientConfig = {
    region: AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'localhost',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'localhost'
    }
  }

  if (process.env.NODE_ENV === 'development') {
    options.endpoint = process.env.AWS_LOCALSTACK_URL
  }

  return options
}

export const S3_CONFIG: S3ClientConfig = {
  ...(AWS_CONFIG() as S3ClientConfig),
  forcePathStyle: true
}

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'local-bucket'

/** The collection name for the No-SQL db that stores the faces */
export const AWS_REKOGNITION_COLLECTION_IDS = {
  kycFaces: 'kyc-faces'
}
