import { User } from 'app/models/user.model'

type UpdateableUserFields = {
  email: string
  first_name: string
  last_name: string
  user_name: string
  enable_authenticator: boolean
  enable_sms: boolean
  enable_password: boolean
}
type NonUpdateableUserFields = Omit<User, keyof UpdateableUserFields>
type UpdateableWithNonUpdateableUserFields = UpdateableUserFields & {
  [Key in keyof NonUpdateableUserFields]: never
}

export class ProfileService {
  constructor(private __userRepository: typeof User) {}

  async get(email: string) {
    const user = await this.__userRepository.findOne({
      where: { email: email }
    })
    if (user) {
      return {
        email,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        enable_authenticator: user.enable_authenticator,
        enable_sms: user.enable_sms,
        enable_password: user.enable_password
      }
    } else {
      throw new Error('Could not find the user')
    }
  }

  async update(
    email: string,
    user_name: string,
    newValues: Partial<UpdateableWithNonUpdateableUserFields>
  ) {
    const data = {
      email: newValues.email,
      first_name: newValues.first_name,
      last_name: newValues.last_name,
      user_name: newValues.user_name,
      enable_authenticator: newValues.enable_authenticator,
      enable_sms: newValues.enable_sms,
      enable_password: newValues.enable_password
    }

    if (newValues.email && email !== newValues.email) {
      return 'unimplemented'
    }

    if (newValues.user_name && user_name !== newValues.user_name) {
      return 'unimplemented'
    }

    const updateResult = await this.__userRepository.update(data, {
      where: { email: email }
    })

    if (updateResult[0] !== 1) {
      throw new Error(`Could not find user with email: ${email}`)
    }

    return 'success'
  }
}
