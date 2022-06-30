import { Model, DataTypes, Sequelize } from 'sequelize'

export class CoinMetricsModel extends Model {
  public id!: number
  public token!: string
  public image!: string
  public usdValue!: string
  public marketCap!: string
  public dayChange!: string
  public symbol!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const create = (sequelize: Sequelize) =>
  CoinMetricsModel.init(
    {
      token: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.JSON
      },
      usdValue: {
        type: DataTypes.DECIMAL(30, 10)
      },
      marketCap: {
        type: DataTypes.DECIMAL(30, 10)
      },
      dayChange: {
        type: DataTypes.DECIMAL(30, 10)
      },
      symbol: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'coinMetricsData',
      sequelize: sequelize // this bit is important
    }
  )
