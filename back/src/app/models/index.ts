import * as UserModel from './user.model';
import * as HistoryModel from './history.model';
import * as InvestorDetailModel from './investordetails.model';
import * as NewsModel from './news.model';
import * as SupportRequestModel from './supportrequest.model';
import * as StrongnodeCoinDataModel from './strongnodecoindata.model';
import * as CoinMetricsDataModel from './coinmetrics.model';
import * as UserWalletsModel from './userwallets.model'
import * as Sequelize from 'sequelize';

const dbConfig = require('../config/db.config.js');
const { Umzug, SequelizeStorage } = require('umzug');

export const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: {},

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

// setup migrations
const umzug = new Umzug({
  migrations: { glob: __dirname + '/../migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console
});

(async () => {
  console.log('Starting DB migrations')
  await umzug.up();
  console.log('Migrations finished')
})();

UserModel.create(sequelize);
HistoryModel.create(sequelize);
InvestorDetailModel.create(sequelize);
NewsModel.create(sequelize);
SupportRequestModel.create(sequelize);
StrongnodeCoinDataModel.create(sequelize);
CoinMetricsDataModel.create(sequelize);
UserWalletsModel.create(sequelize);

export { Sequelize };
export const History = HistoryModel.History;
export const News = NewsModel.News;
export const User = UserModel.User;
export const InvestorDetail = InvestorDetailModel.InvestorDetail;
export const SupportRequest = SupportRequestModel.SupportRequest;
export const StrongnodeCoinData = StrongnodeCoinDataModel.StrongnodeCoinData;
export const CoinMetricsData = CoinMetricsDataModel.CoinMetricsModel;
export const UserWallets = UserWalletsModel.UserWallets;

/** @deprecated */
export const history = HistoryModel.History;
/** @deprecated */
export const news = NewsModel.News;
/** @deprecated */
export const users = UserModel.User;
/** @deprecated */
export const investordetails = InvestorDetailModel.InvestorDetail;
/** @deprecated */
export const supportrequests = SupportRequestModel.SupportRequest;

