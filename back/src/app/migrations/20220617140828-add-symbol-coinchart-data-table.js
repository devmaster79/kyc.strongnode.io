const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('coinChartData', 'symbol', Sequelize.STRING)
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('coinChartData', 'symbol')
}

module.exports = { up, down }
