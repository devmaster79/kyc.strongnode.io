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
export const AWS_REGION = process.env.AWS_REGION || 'eu-west-1'

export const AWS_CONFIG = (): SESClientConfig => {
  if (process.env.NODE_ENV === 'development') {
    return {
      endpoint: process.env.AWS_LOCALSTACK_URL
    }
  }

  return {}
}

export const S3_CLIENT_CONFIG: S3ClientConfig = {
  ...(AWS_CONFIG() as S3ClientConfig),
  forcePathStyle: true
}

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'local-bucket'

/** The collection name for the No-SQL db that stores the faces */
export const AWS_REKOGNITION_COLLECTION_IDS = {
  kycFaces: 'kyc-faces'
}
