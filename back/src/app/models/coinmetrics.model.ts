import { Model, DataTypes, Sequelize } from "sequelize";

export class CoinMetricsModel extends Model {
  public id!: number
  public token!: string
  public image!: object
  public usd_value!: string
  public market_cap!: string
  public day_change!: string
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const create = (sequelize: Sequelize) => CoinMetricsModel.init({
  token: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.JSON
  },
  usd_value: {
    type: DataTypes.DECIMAL(30, 10),
  },
  market_cap: {
    type: DataTypes.DECIMAL(30, 10),
  },
  day_change: {
    type: DataTypes.DECIMAL(30, 10),
  }
}, {
  tableName: 'coinMetricsData',
  sequelize: sequelize, // this bit is important
});
