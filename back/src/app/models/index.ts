import * as UserModel from './user.model'
import * as InvestorDetailModel from './investordetails.model'
import * as SupportRequestModel from './supportrequest.model'
import * as StrongnodeCoinDataModel from './strongnodecoindata.model'
import * as CoinMetricsDataModel from './coinmetrics.model'
import * as dVPNAccessModel from './dvpnaccess.model'
import * as dVPNUsageModel from './dvpnusage.model'
import * as UserWalletsModel from './userwallets.model'
import * as Sequelize from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'
import { Logger } from 'app/services/Logger'
import dbConfig from '../config/db.config'

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

const logger = new Logger('Umzug migrations')

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
  logger.log('Migrations finished')
})()

UserModel.create(sequelize)
InvestorDetailModel.create(sequelize)
SupportRequestModel.create(sequelize)
StrongnodeCoinDataModel.create(sequelize)
CoinMetricsDataModel.create(sequelize)
UserWalletsModel.create(sequelize)
dVPNAccessModel.create(sequelize)
dVPNUsageModel.create(sequelize)

export { Sequelize }
export const User = UserModel.User
export const InvestorDetail = InvestorDetailModel.InvestorDetail
export const SupportRequest = SupportRequestModel.SupportRequest
export const StrongnodeCoinData = StrongnodeCoinDataModel.StrongnodeCoinData
export const CoinMetricsData = CoinMetricsDataModel.CoinMetricsModel
export const UserWallets = UserWalletsModel.UserWallets
export const dVPNAccess = dVPNAccessModel.dVPNaccessModel
export const dVPNUsage = dVPNUsageModel.dVPNUsageModel

/** @deprecated */
export const users = UserModel.User
/** @deprecated */
export const investordetails = InvestorDetailModel.InvestorDetail
/** @deprecated */
export const supportrequests = SupportRequestModel.SupportRequest
