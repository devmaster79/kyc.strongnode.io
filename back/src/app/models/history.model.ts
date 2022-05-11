import { Model, DataTypes, Sequelize } from 'sequelize'

export class History extends Model {
  public id!: number
  public user_name!: string
  public action_type!: 'vested' | 'earned' | 'unlocked' | 'withdrawn'
  public token_amount!: string
  public date!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}
export const create = (sequelize: Sequelize) =>
  History.init(
    {
      user_name: {
        type: DataTypes.STRING
      },
      action_type: {
        type: DataTypes.ENUM('vested', 'earned', 'unlocked', 'withdrawn')
      },
      token_amount: {
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
