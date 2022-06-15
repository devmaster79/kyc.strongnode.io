import { Model, DataTypes, Sequelize } from 'sequelize'

export class User extends Model {
  public id!: number
  public firstName!: string
  public lastName!: string
  public email!: string
  public username!: string
  public profileImgType!: string
  public profileImgUrl!: string
  public profileImgData!: string
  public profileImgKey!: string
  public emailVerified!: boolean
  public token!: string
  public passwordToken!: string
  public password!: string
  public smscode!: string
  public authenticatorQrSecret!: string
  public phoneNumber!: string
  public enablePassword!: boolean
  public enableAuthenticator!: boolean
  public enableSms!: boolean
  public telegramId!: string
  public twitterId!: string
  public walletAddress!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const create = (sequelize: Sequelize) =>
  User.init(
    {
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      username: {
        type: DataTypes.STRING
      },
      profileImgType: {
        type: DataTypes.STRING
      },
      profileImgUrl: {
        type: DataTypes.STRING
      },
      profileImgData: {
        type: DataTypes.BLOB('long')
      },
      profileImgKey: {
        type: DataTypes.STRING
      },
      emailVerified: {
        type: DataTypes.BOOLEAN
      },
      token: {
        type: DataTypes.STRING
      },
      passwordToken: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      smscode: {
        type: DataTypes.STRING
      },
      authenticatorQrSecret: {
        type: DataTypes.STRING
      },
      phoneNumber: {
        type: DataTypes.STRING
      },
      enablePassword: {
        type: DataTypes.BOOLEAN
      },
      enableAuthenticator: {
        type: DataTypes.BOOLEAN
      },
      enableSms: {
        type: DataTypes.BOOLEAN
      },
      telegramId: {
        type: DataTypes.STRING
      },
      twitterId: {
        type: DataTypes.STRING
      },
      walletAddress: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'users',
      sequelize: sequelize // this bit is important
    }
  )
