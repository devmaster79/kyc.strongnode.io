const bcrypt = require('bcryptjs')

import { dVPNAccess as dVPNAccessModel } from '../../models'
import { generate } from 'generate-password'

/**
 * const for salting password hashes, more than 10 makes it really slow on localhost
 * @type {number}
 * TODO: refactor the SALT_ROUNDS and __generateHashBcrypt to a utils component / service.
 */
const SALT_ROUNDS = 10

export interface ICreatedAccess {
  id: number
  password: string
  access: boolean
  createdAt: Date
  updatedAt: Date
  generatedPassword?: string
}

export class DVPNService {
  constructor(
    private userId: number,
    private __dVPNAccessModel: typeof dVPNAccessModel
  ) {}

  private passwordVerified = false

  /**
   * Method that creates access to the dVPN.
   */
  async createAccess(activate = false) {
    const checkAccess = await this.__dVPNAccessModel.findOne({
      where: { userId: this.userId }
    })

    let access
    if (checkAccess) {
      access = await this.__dVPNAccessModel
        .update(
          {
            access: activate,
            password: ''
          },
          { where: { userId: this.userId } }
        )
        .toJSON()
    } else {
      access = await this.__dVPNAccessModel
        .create({
          userId: this.userId,
          password: '',
          access: activate
        })
        .toJSON()
    }

    if (!access) return false

    if (activate) {
      const generatedPassword = await this.generateAccessPassword()

      return { ...access, generatedPassword }
    }
    return access
  }

  /**
   * Method that verifies password.
   */
  async verifyAccessPassword(password: string) {
    const dVPNRecord = await this.__dVPNAccessModel.findOne({
      where: { userId: this.userId }
    })

    if (dVPNRecord) {
      const result = bcrypt.compareSync(password, dVPNRecord.password)
      this.passwordVerified = result

      return result
    } else {
      return false
    }
  }

  /**
   * Method that generates password and saves it to the database.
   */
  async generateAccessPassword() {
    const password = generate({ length: 8, numbers: true })
    const access = await this.__dVPNAccessModel.update(
      { password: await this.__generateHashBcrypt(password) },
      { where: { userId: this.userId } }
    )

    return access ? password : false
  }

  /**
   * Method that generates hash for specific password using bcrypt
   * @returns {Promise<string>}
   */
  async __generateHashBcrypt(password: string) {
    // return empty strings
    if (password === '') return false

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    return await bcrypt.hash(password, salt).then((hash: string) => {
      return hash
    })
  }

  /**
   * Regenerates user's dVPN password.
   */
  regenerateAccessPassword() {
    return this.generateAccessPassword()
  }

  /**
   * Method that saves the user usage of dVPN to the database.
   */
  saveUsage() {
    // todo
  }

  /**
   * Method that verifies
   */
  async hasAccess(passwordCheck = true) {
    const access = await this.__dVPNAccessModel.findOne({
      where: { userId: this.userId }
    })

    if (passwordCheck) {
      return access && this.passwordVerified ? access.access : false
    } else {
      return access ? access.access : false
    }
  }

  /**
   * Method that enables user access to the dVPN.
   * e.g.: when user renews his disabled subscription
   */
  async enableAccess() {
    return this.__dVPNAccessModel.update(
      {
        access: true
      },
      { where: { userId: this.userId } }
    )
  }

  /**
   * Method that disables user access to the dVPN.
   * e.g.: when user does not renew his subscription
   */
  async disableAccess() {
    return this.__dVPNAccessModel.update(
      {
        access: false
      },
      { where: { userId: this.userId } }
    )
  }
}
