import { AppLogger } from 'app/services/Logger'
import dotenv from 'dotenv'
import path from 'path'
import { Sequelize } from 'sequelize'
dotenv.config({ path: path.join(__dirname, '../../../.env') })
import dbConfig from '../config/db.config'
import { Umzug, SequelizeStorage } from 'umzug'

// check if arguments are present
if (process.argv.length === 2) {
  AppLogger.error('Expected at least one argument!')
  process.exit(1)
}

// get arguments
const myArgs = process.argv

// connect DB
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
})

// setup migrations
const umzug = new Umzug({
  migrations: { glob: __dirname + '/../migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: AppLogger
})

// run the exec loop
;(() => {
  AppLogger.log('Starting migrations')
  process.argv.forEach(async function (val, index) {
    if (val === 'up') {
      // run the migrations
      await umzug.up()
      AppLogger.info('Successfully migrated upwards!')
    } else if (val === 'down') {
      // revert the migrations
      if (typeof myArgs[index + 1] !== 'undefined') {
        await umzug.down({
          step: parseInt(myArgs[index + 1].replaceAll('-', ''))
        })
      } else {
        await umzug.down()
      }
      AppLogger.info('Successfully migrated downwards!')
    } else {
      AppLogger.info('wrong option: ', val)
    }
  })
})()
