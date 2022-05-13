const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'updatedAt', Sequelize.DATE)
  await queryInterface.addColumn('histories', 'updatedAt', Sequelize.DATE)
  await queryInterface.addColumn('news', 'updatedAt', Sequelize.DATE)
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'updatedAt')
  await queryInterface.removeColumn('histories', 'updatedAt')
  await queryInterface.removeColumn('news', 'updatedAt')
}

module.exports = { up, down }
