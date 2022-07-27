import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize'
import { VerificationSubject } from 'shared/endpoints/kycAdmin'
import { User } from './user.model'

/** AWS S3 key. The whole photo */
export const IDENTITY_PHOTO_KEY = (userId: number, documentType: string) =>
  `${userId}_${documentType}`
/** AWS S3 key. Only the face from the photo */
export const IDENTITY_PHOTO_FACE_KEY = (userId: number, documentType: string) =>
  `${userId}_${documentType}_face`
/** AWS S3 key. The whole photo */
export const USER_WITH_IDENTITY_PHOTO_KEY = (
  userId: number,
  documentType: string
) => `${userId}_user_with_${documentType}`
/** AWS S3 key. Only the face from the photo */
export const USER_WITH_IDENTITY_PHOTO_FACE_KEY = (
  userId: number,
  documentType: string,
  nth: number
) => `${userId}_user_with_${documentType}_face_${nth}`

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

  // pre-declare possible inclusions
  declare user?: NonAttribute<User>
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
