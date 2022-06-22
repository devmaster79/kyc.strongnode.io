import { User } from 'app/models/user.model'
import { GravatarService } from '../GravatarService'
import { UploadImageService } from './UploadImageService'

type UpdateableUserFields = {
  email: string
  firstName: string
  lastName: string
  username: string
  enableAuthenticator: boolean
  enableSms: boolean
  enablePassword: boolean
  profileImgUrl: string
}
type NonUpdateableUserFields = Omit<User, keyof UpdateableUserFields>
type UpdateableWithNonUpdateableUserFields = UpdateableUserFields & {
  [Key in keyof NonUpdateableUserFields]: never
}

export class ProfileService {
  constructor(
    private __userRepository: typeof User,
    private __gravatarService: GravatarService,
    private __uploadImageService: UploadImageService
  ) {}

  async get(email: string) {
    const user = await this.__userRepository.findOne({
      where: { email: email }
    })
    if (user) {
      const profileImgUrl =
        user.profileImgUrl ||
        ((await this.__gravatarService.getProfileImageURL(email)) as string)
      return {
        email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        enableAuthenticator: user.enableAuthenticator,
        enableSms: user.enableSms,
        enablePassword: user.enablePassword,
        profileImgUrl
      }
    } else {
      throw new Error('Could not find the user')
    }
  }

  async update(
    email: string,
    username: string,
    newValues: Partial<UpdateableWithNonUpdateableUserFields>
  ) {
    const data = {
      email: newValues.email,
      firstName: newValues.firstName,
      lastName: newValues.lastName,
      username: newValues.username,
      enableAuthenticator: newValues.enableAuthenticator,
      enableSms: newValues.enableSms,
      enablePassword: newValues.enablePassword
    }

    if (newValues.email && email !== newValues.email) {
      return { result: 'unimplemented' }
    }

    if (newValues.username && username !== newValues.username) {
      const username = newValues.username
      const user = await this.__userRepository.findOne({
        where: { username: username }
      })
      if (user) return { result: 'username-is-already-taken' }
    }

    const updateResult = await this.__userRepository.update(data, {
      where: { email: email }
    })

    if (updateResult[0] !== 1) {
      throw new Error(`Could not find user with email: ${email}`)
    }
    const user = await this.get(newValues.email || email)
    return {
      result: 'success',
      modifiedUser: user
    }
  }

  async updateAvatar(email: string, file: Express.Multer.File) {
    const data = {
      profileImgUrl: await this.__uploadImageService.upload(file)
    }
    const updateResult = await this.__userRepository.update(data, {
      where: { email: email }
    })

    if (updateResult[0] !== 1) {
      throw new Error(`Could not find user with email: ${email}`)
    }

    return 'success' as const
  }
}
