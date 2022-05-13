import { ServiceConfigurationOptions } from 'aws-sdk/lib/service'

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

export const AWS_CONFIG = (): ServiceConfigurationOptions => {
  const options: ServiceConfigurationOptions = {
    region: 'us-west-2'
  }

  if (process.env.NODE_ENV === 'development') {
    options.endpoint = process.env.AWS_LOCALSTACK_URL
  }

  return options
}
