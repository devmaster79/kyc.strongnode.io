// AUTH
export const sendVerificationEmail = '/api/auth/sendVerificationEmail'
export const register = '/api/auth/register'
export const enablePasswordAuth = '/api/auth/enablePasswordAuth'
export const disablePasswordAuth = '/api/auth/disablePasswordAuth'
export const authByPassword = '/api/auth/authByPassword'
export const sendSMSToUser = '/api/auth/sendSMSToUser'
export const authBySMSCode = '/api/auth/authBySMSCode'
export const sendSMSAndSaveNumber = '/api/auth/sendSMSAndSaveNumber'
export const enableSMSAuth = '/api/auth/enableSMSAuth'
export const disableSMSAuth = '/api/auth/disableSMSAuth'
export const authByAuthenticator = '/api/auth/authByAuthenticator'
export const generateAuthenticatorQRCode =
  '/api/auth/generateAuthenticatorQRCode'
export const enableAuthenticatorAuth = '/api/auth/enableAuthenticatorAuth'
export const disableAuthenticatorAuth = '/api/auth/disableAuthenticatorAuth'

// CRYPTO
export const getCryptoChartData = '/api/cryptocurrency/chart/'
export const getTokenMetrics = '/api/cryptocurrency/token-metrics/'
