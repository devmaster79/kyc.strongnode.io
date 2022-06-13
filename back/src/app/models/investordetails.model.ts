import { Model, DataTypes, Sequelize } from 'sequelize'

export class InvestorDetail extends Model {
  public id!: number
  public userId!: number
  public references!: string
  public investorName!: string
  public investorTelegramId!: string
  public investorCountry!: string
  public investorCommitmentAmount!: string
  public investorWalletAddress!: string
  public investorEmail!: string
  public investorFundName!: string
  public investorFundWebsite!: string
  public reviewed!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}
export const create = (sequelize: Sequelize) =>
  InvestorDetail.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      investorName: {
        type: DataTypes.STRING
      },
      investorTelegramId: {
        type: DataTypes.STRING
      },
      investorCountry: {
        type: DataTypes.STRING
      },
      investorCommitmentAmount: {
        type: DataTypes.STRING
      },
      investorWalletAddress: {
        type: DataTypes.STRING
      },
      investorEmail: {
        type: DataTypes.STRING
      },
      investorFundName: {
        type: DataTypes.STRING
      },
      investorFundWebsite: {
        type: DataTypes.STRING
      },
      reviewed: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: 'investorDetails',
      sequelize: sequelize // this bit is important
    }
  )
