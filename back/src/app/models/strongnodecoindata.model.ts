import { Model, DataTypes, Sequelize } from 'sequelize'
import { GetTokenChartData } from 'shared/endpoints/cryptocurrency'

export class StrongnodeCoinData extends Model {
  public id!: number
  public scope!: string
  public token!: string
  public data!: GetTokenChartData.CoinMarketData
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const create = (sequelize: Sequelize) =>
  StrongnodeCoinData.init(
    {
      scope: {
        type: DataTypes.STRING
      },
      token: {
        type: DataTypes.STRING
      },
      data: {
        type: DataTypes.JSON
      },
      symbol: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'coinChartData',
      sequelize: sequelize // this bit is important
    }
  )
