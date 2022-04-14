import * as urls from '../../utils/config'
import { getResponseData, setToken } from './utils'
import {
  Success,
  UnauthorizedError,
  UnexpectedError,
  ValidationError
} from './responses'

type SendVerificationEmailRequest = { email: string }
type SendVerificationEmailResponse = Success | UnexpectedError | ValidationError<'email', undefined>
function sendVerificationEmail (email: string) {
  return getResponseData<
    SendVerificationEmailRequest,
    SendVerificationEmailResponse
  >(urls.sendVerificationEmail, { email })
}

type RegisterRequest = {
  user_name: string;
  first_name: string;
  last_name: string;
}
type RegisterResponse = Success & { token: string }
  | UnexpectedError
  | UnauthorizedError
  | ValidationError<'user_name', undefined>
  | ValidationError<'user_name', 'already-taken'>
  | ValidationError<'first_name', undefined>
  | ValidationError<'last_name', undefined>
async function register (params: RegisterRequest) {
  const data = await getResponseData<RegisterRequest, RegisterResponse>(
    urls.register,
    {
      user_name: params.user_name,
      first_name: params.first_name,
      last_name: params.last_name
    }
  )
  if (data.result === 'success') {
    setToken(data.token)
  }
  return data
}

const signOut = () => {
  localStorage.clear()
  setToken(null)
}

/* utils */
export { setToken, signOut }
/* login / preRegister  */
export { sendVerificationEmail }
/* Register */
export { RegisterResponse, register }
/* Password Auth */
export * from './passwordAuthService'
/* SMS Auth */
export * from './smsAuthService'
/* Authenticator Auth */
export * from './authenticatorAuthService'
