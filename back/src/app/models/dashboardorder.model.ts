import { Model, DataTypes, Sequelize } from 'sequelize'

export class DashboardOrder extends Model {
  public id!: number
  public dashboardItem!: string
  public position!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const create = (sequelize: Sequelize) =>
  DashboardOrder.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      dashboardItem: {
        type: DataTypes.STRING
      },
      position: {
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: 'dashboardOrder',
      sequelize: sequelize // this bit is important
    }
  )
