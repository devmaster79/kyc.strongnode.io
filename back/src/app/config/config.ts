import { SESClientConfig } from '@aws-sdk/client-ses'
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

export const AWS_CONFIG = (): SESClientConfig => {
  const options: SESClientConfig = {
    region: 'us-west-2'
  }

  if (process.env.NODE_ENV === 'development') {
    options.endpoint = process.env.AWS_LOCALSTACK_URL
  }

  return options
}

/** The collection name for the No-SQL db that stores the faces */
export const AWS_REKOGNITION_COLLECTION_IDS = {
  kycFaces: 'kyc-faces'
}
