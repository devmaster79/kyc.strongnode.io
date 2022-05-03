import * as urls from '../../utils/config'
import { getResponseData, setToken } from './utils'
import { Register, SendVerificationEmail } from 'shared/endpoints/auth'

function sendVerificationEmail(email: string) {
  return getResponseData<
    SendVerificationEmail.Request,
    SendVerificationEmail.Response
  >(urls.sendVerificationEmail, { email })
}

async function register(params: Register.Request['body']) {
  const data = await getResponseData<Register.Request, Register.Response>(
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
export { register }
/* Password Auth */
export * from './passwordAuthService'
/* SMS Auth */
export * from './smsAuthService'
/* Authenticator Auth */
export * from './authenticatorAuthService'
