import { Model, DataTypes, Sequelize } from 'sequelize'

export class History extends Model {
  public id!: number
  public username!: string
  public actionType!: 'vested' | 'earned' | 'unlocked' | 'withdrawn'
  public tokenAmount!: string
  public date!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}
export const create = (sequelize: Sequelize) =>
  History.init(
    {
      username: {
        type: DataTypes.STRING
      },
      actionType: {
        type: DataTypes.ENUM('vested', 'earned', 'unlocked', 'withdrawn')
      },
      tokenAmount: {
        type: DataTypes.STRING
      },
      date: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: 'histories',
      sequelize: sequelize // this bit is important
    }
  )
