import { Model, DataTypes, Sequelize } from 'sequelize'

export class dVPNUsageModel extends Model {
  public id!: number
  public bytesIn!: number
  public bytesOut!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const create = (sequelize: Sequelize) =>
  dVPNUsageModel.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      bytesIn: {
        type: DataTypes.DOUBLE
      },
      bytesOut: {
        type: DataTypes.DOUBLE
      }
    },
    {
      tableName: 'dVPNUsage',
      sequelize: sequelize // this bit is important
    }
  )
