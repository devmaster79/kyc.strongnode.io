import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize'

export enum VerificationStatus {
  VerifiedByAi = 'VerifiedByAi',
  VerifiedByAdmin = 'VerifiedByAdmin'
}

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>
  declare firstName: string
  declare lastName: string
  declare email: string
  declare username: string
  declare profileImgType: string
  declare profileImgUrl: string
  declare profileImgData: string
  declare profileImgKey: string
  declare emailVerified: boolean
  declare token: string
  declare passwordToken: string
  declare password: string
  declare smscode: string
  declare authenticatorQrSecret: string
  declare phoneNumber: string
  declare enablePassword: boolean
  declare enableAuthenticator: boolean
  declare enableSms: boolean
  declare telegramId: string
  declare twitterId: string
  declare walletAddress: string
  declare birthday: Date | string // sequalize....
  declare identityVerified: VerificationStatus
}

export const create = (sequelize: Sequelize) =>
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
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
      },
      birthday: {
        type: DataTypes.DATEONLY
      },
      identityVerified: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'users',
      sequelize: sequelize // this bit is important
    }
  )
