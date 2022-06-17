const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('coinMetricsData', 'symbol', Sequelize.STRING)
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('coinMetricsData', 'symbol')
}

module.exports = { up, down }
