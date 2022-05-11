import { Model, DataTypes, Sequelize } from 'sequelize'

export class News extends Model {
  public id!: number
  public logo!: string
  public title!: string
  public description!: string
  public status!: 'active' | 'inactive'

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}
export const create = (sequelize: Sequelize) =>
  News.init(
    {
      logo: {
        type: DataTypes.STRING
      },
      title: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive')
      }
    },
    {
      tableName: 'news',
      sequelize: sequelize // this bit is important
    }
  )
