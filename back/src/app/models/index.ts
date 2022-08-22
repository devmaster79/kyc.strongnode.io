import * as UserModel from './user.model'
import * as InvestorDetailModel from './investordetails.model'
import * as SupportRequestModel from './supportrequest.model'
import * as StrongnodeCoinDataModel from './strongnodecoindata.model'
import * as CoinMetricsDataModel from './coinmetrics.model'
import * as dVPNAccessModel from './dvpnaccess.model'
import * as dVPNUsageModel from './dvpnusage.model'
import * as UserWalletsModel from './userwallets.model'
import * as KycEntryModel from './kycEntry.model'
import * as DashboardOrderModel from './dashboardorder.model'
import * as Sequelize from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'
import { Logger } from 'app/services/Logger'
import dbConfig from '../config/db.config'
import { RekognitionCollectionService } from 'app/services/KYC/RekognitionCollectionService'
import {
  AWS_REKOGNITION_COLLECTION_IDS,
  AWS_REKOGNITION_CONFIG
} from 'app/config/config'
import { Rekognition } from '@aws-sdk/client-rekognition'

export const sequelize = new Sequelize.Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: {},

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
)

const logger = new Logger('Models')

// setup migrations
const umzug = new Umzug({
  migrations: { glob: __dirname + '/../migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger
})

;(async () => {
  logger.log('Starting DB migrations')
  await umzug.up()
  logger.log('Migrations are finished')
  try {
    logger.log('Initializing KYC face collection')
    const rekoCollectionService = new RekognitionCollectionService(
      new Rekognition(AWS_REKOGNITION_CONFIG())
    )
    await rekoCollectionService.getOrCreate(
      AWS_REKOGNITION_COLLECTION_IDS.kycFaces
    )
    logger.log('Init is finished')
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn(
        'Could not init face DB, but it is okay in development. The reason:',
        (e as { code: undefined | string } | undefined)?.code
      )
    } else {
      logger.error('Could not init face DB. The reason:', e)
    }
  }
})()

UserModel.create(sequelize)
InvestorDetailModel.create(sequelize)
SupportRequestModel.create(sequelize)
StrongnodeCoinDataModel.create(sequelize)
CoinMetricsDataModel.create(sequelize)
UserWalletsModel.create(sequelize)
dVPNAccessModel.create(sequelize)
dVPNUsageModel.create(sequelize)
KycEntryModel.create(sequelize)
DashboardOrderModel.create(sequelize)

UserModel.User.hasMany(KycEntryModel.KycEntry, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'kycEntries'
})

KycEntryModel.KycEntry.belongsTo(UserModel.User, {
  foreignKey: 'userId',
  targetKey: 'id',
  as: 'user'
})

export { Sequelize }
export const User = UserModel.User
export const InvestorDetail = InvestorDetailModel.InvestorDetail
export const SupportRequest = SupportRequestModel.SupportRequest
export const StrongnodeCoinData = StrongnodeCoinDataModel.StrongnodeCoinData
export const CoinMetricsData = CoinMetricsDataModel.CoinMetricsModel
export const UserWallets = UserWalletsModel.UserWallets
export const dVPNAccess = dVPNAccessModel.dVPNaccessModel
export const dVPNUsage = dVPNUsageModel.dVPNUsageModel
export const KycEntry = KycEntryModel.KycEntry
export const DashboardOrder = DashboardOrderModel.DashboardOrder

/** @deprecated */
export const users = UserModel.User
/** @deprecated */
export const investordetails = InvestorDetailModel.InvestorDetail
/** @deprecated */
export const supportrequests = SupportRequestModel.SupportRequest
