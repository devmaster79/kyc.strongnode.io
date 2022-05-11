import * as UserModel from './user.model'
import * as HistoryModel from './history.model'
import * as InvestorDetailModel from './investordetails.model'
import * as NewsModel from './news.model'
import * as SupportRequestModel from './supportrequest.model'
import * as StrongnodeCoinDataModel from './strongnodecoindata.model'
import * as CoinMetricsDataModel from './coinmetrics.model'
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
HistoryModel.create(sequelize)
InvestorDetailModel.create(sequelize)
NewsModel.create(sequelize)
SupportRequestModel.create(sequelize)
StrongnodeCoinDataModel.create(sequelize)
CoinMetricsDataModel.create(sequelize)

export { Sequelize }
export const History = HistoryModel.History
export const News = NewsModel.News
export const User = UserModel.User
export const InvestorDetail = InvestorDetailModel.InvestorDetail
export const SupportRequest = SupportRequestModel.SupportRequest
export const StrongnodeCoinData = StrongnodeCoinDataModel.StrongnodeCoinData
export const CoinMetricsData = CoinMetricsDataModel.CoinMetricsModel

/** @deprecated */
export const history = HistoryModel.History
/** @deprecated */
export const news = NewsModel.News
/** @deprecated */
export const users = UserModel.User
/** @deprecated */
export const investordetails = InvestorDetailModel.InvestorDetail
/** @deprecated */
export const supportrequests = SupportRequestModel.SupportRequest
