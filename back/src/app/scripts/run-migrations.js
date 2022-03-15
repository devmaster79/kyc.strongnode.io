// check if arguments are present
if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
}

// get arguments
const myArgs = process.argv

// load dotenv
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../../.env' });

const dbConfig = require('../config/db.config.js');
const { Umzug, SequelizeStorage } = require('umzug');

// connect DB
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

// run the exec loop
(() => {
    console.log('Starting migrations')
    process.argv.forEach(async function (val, index, array) {
        if (val === 'up') {
            // run the migrations
            await umzug.up();
            console.info('Successfully migrated upwards!');
        } else if (val === 'down') {
            // revert the migrations
            const downOptions = {}

            if (typeof myArgs[index + 1] !== 'undefined')
                downOptions.step = myArgs[index + 1].replaceAll('-', '')

            await umzug.down(downOptions);
            console.info('Successfully migrated downwards!')
        } else {
            console.info("wrong option: ", val);
        }
    });
})();
