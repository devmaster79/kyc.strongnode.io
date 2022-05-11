import { Model, DataTypes, Sequelize } from 'sequelize'

export class User extends Model {
  public id!: number
  public first_name!: string
  public last_name!: string
  public email!: string
  public user_name!: string
  public profile_img_type!: string
  public profile_img_url!: string
  public profile_img_data!: string
  public profile_img_key!: string
  public email_verified!: boolean
  public token!: string
  public password_token!: string
  public password!: string
  public smscode!: string
  public authenticator_qr_secret!: string
  public phone_number!: string
  public enable_password!: boolean
  public enable_authenticator!: boolean
  public enable_sms!: boolean
  public telegram_id!: string
  public twitter_id!: string
  public wallet_address!: string
  public investor_name!: string
  public investor_telegram_id!: string
  public investor_country!: string
  public investor_commitment_amount!: string
  public investor_wallet_address!: string
  public investor_email!: string
  public investor_fund_name!: string
  public investor_fund_website!: string
  public vested_amount!: string
  public locked_bonus_amount!: string
  public earned_amount!: string
  public lockedup_amount!: string
  public withdrawn_total_amount!: string
  public remaining_total_amount!: string
  public purchased_date!: string
  public purchased_round!: string
  public purchased_total!: string
  public investment_amount!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const create = (sequelize: Sequelize) =>
  User.init(
    {
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      user_name: {
        type: DataTypes.STRING
      },
      profile_img_type: {
        type: DataTypes.STRING
      },
      profile_img_url: {
        type: DataTypes.STRING
      },
      profile_img_data: {
        type: DataTypes.BLOB('long')
      },
      profile_img_key: {
        type: DataTypes.STRING
      },
      email_verified: {
        type: DataTypes.BOOLEAN
      },
      token: {
        type: DataTypes.STRING
      },
      password_token: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      smscode: {
        type: DataTypes.STRING
      },
      authenticator_qr_secret: {
        type: DataTypes.STRING
      },
      phone_number: {
        type: DataTypes.STRING
      },
      enable_password: {
        type: DataTypes.BOOLEAN
      },
      enable_authenticator: {
        type: DataTypes.BOOLEAN
      },
      enable_sms: {
        type: DataTypes.BOOLEAN
      },
      telegram_id: {
        type: DataTypes.STRING
      },
      twitter_id: {
        type: DataTypes.STRING
      },
      wallet_address: {
        type: DataTypes.STRING
      },
      investor_name: {
        type: DataTypes.STRING
      },
      investor_telegram_id: {
        type: DataTypes.STRING
      },
      investor_country: {
        type: DataTypes.STRING
      },
      investor_commitment_amount: {
        type: DataTypes.STRING
      },
      investor_wallet_address: {
        type: DataTypes.STRING
      },
      investor_email: {
        type: DataTypes.STRING
      },
      investor_fund_name: {
        type: DataTypes.STRING
      },
      investor_fund_website: {
        type: DataTypes.STRING
      },
      vested_amount: {
        type: DataTypes.STRING
      },
      locked_bonus_amount: {
        type: DataTypes.STRING
      },
      earned_amount: {
        type: DataTypes.STRING
      },
      lockedup_amount: {
        type: DataTypes.STRING
      },
      withdrawn_total_amount: {
        type: DataTypes.STRING
      },
      remaining_total_amount: {
        type: DataTypes.STRING
      },
      purchased_date: {
        type: DataTypes.DATE
      },
      purchased_round: {
        type: DataTypes.STRING
      },
      purchased_total: {
        type: DataTypes.STRING
      },
      investment_amount: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'users',
      sequelize: sequelize // this bit is important
    }
  )
