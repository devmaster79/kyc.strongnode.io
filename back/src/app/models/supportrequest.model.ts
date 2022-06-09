import { Model, DataTypes, Sequelize } from 'sequelize'

export class SupportRequest extends Model {
  public id!: number
  public userId!: number
  public subject!: string
  public message!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}
export const create = (sequelize: Sequelize) =>
  SupportRequest.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      subject: {
        type: DataTypes.STRING
      },
      message: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'supportRequests',
      sequelize: sequelize // this bit is important
    }
  )
