const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'identityVerified')
  await queryInterface.addColumn('users', 'identityVerified', Sequelize.JSON)
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'identityVerified')
  await queryInterface.addColumn('users', 'identityVerified', Sequelize.STRING)
}

module.exports = { up, down }
