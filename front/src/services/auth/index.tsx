import * as urls from '../../utils/config'
import { fetchAPI } from '../utils'
import { Register, SendVerificationEmail } from 'shared/endpoints/auth'
import { setToken } from './tokenService'

function sendVerificationEmail(email: string) {
  return fetchAPI<
    SendVerificationEmail.Request,
    SendVerificationEmail.Response
  >('post', urls.sendVerificationEmail, { email })
}

async function register(params: Register.Request['body']) {
  const data = await fetchAPI<Register.Request, Register.Response>(
    'post',
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
