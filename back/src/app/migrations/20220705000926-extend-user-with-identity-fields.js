const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'identityVerified', Sequelize.STRING)
  await queryInterface.addColumn('users', 'birthday', Sequelize.DATEONLY)
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'identityVerified')
  await queryInterface.removeColumn('users', 'birthday')
}

module.exports = { up, down }
