import { Model, DataTypes, Sequelize } from 'sequelize'

export interface IWalletObject {
  id: number
  userId: number
  wallet: string
  createdAt: Date
  updatedAt: Date
}

export class UserWallets extends Model {
  public id!: number
  public userId!: number
  public wallet!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const create = (sequelize: Sequelize) =>
  UserWallets.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      wallet: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'UserWallets',
      sequelize: sequelize // this bit is important
    }
  )
