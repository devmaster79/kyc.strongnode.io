import { Model, DataTypes, Sequelize } from 'sequelize'

export class dVPNaccessModel extends Model {
  public id!: number
  public password!: string
  public access!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const create = (sequelize: Sequelize) =>
  dVPNaccessModel.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      password: {
        type: DataTypes.STRING
      },
      access: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: 'dVPNAccess',
      sequelize: sequelize // this bit is important
    }
  )
