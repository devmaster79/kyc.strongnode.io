import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize'
import { User } from './user.model'

/** What should the admin verify */
export enum VerificationSubject {
  Identity = 'Identity',
  Address = 'Address',
  BillingAddress = 'BillingAddress',
  TaxIdentificationNumber = 'TaxIdentificationNumber'
}

/**
 * Unsubmitted => user.*Verified is null, and this row is NOT present
 * Submitted => user.*Verified may either verifiedByAI or null, and this row is present
 * Verified => user.*Verified is changed, and this row is deleted
 * Failed => user.*Verified is changed, and this row is deleted
 */
export class KycEntry extends Model<
  InferAttributes<KycEntry>,
  InferCreationAttributes<KycEntry>
> {
  declare id: CreationOptional<number>
  declare userId: ForeignKey<User['id']>

  declare documentType: string
  declare verificationSubject: VerificationSubject

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export const create = (sequelize: Sequelize) =>
  KycEntry.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      documentType: {
        type: DataTypes.STRING
      },
      verificationSubject: {
        type: DataTypes.STRING
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      tableName: 'kycEntries',
      sequelize: sequelize
    }
  )
