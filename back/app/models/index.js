const dbConfig = require('../config/db.config.js');
const { Umzug, SequelizeStorage } = require('umzug');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.history = require('./history.model.js')(sequelize, Sequelize);
db.news = require('./news.model.js')(sequelize, Sequelize);
db.users = require('./user.model.js')(sequelize, Sequelize);
db.passwordreset = require('./passwordreset.model.js')(sequelize, Sequelize);
db.investordetails = require('./investordetails.model.js')(sequelize, Sequelize);
db.supportrequests = require('./supportrequest.model.js')(sequelize, Sequelize)

module.exports = db;
