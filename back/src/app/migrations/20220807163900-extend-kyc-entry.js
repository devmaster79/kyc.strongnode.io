const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('kycEntries', 'aiResult', Sequelize.JSON, {
    defaultValue: null,
    allowNull: true
  })
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('kycEntries', 'aiResult')
}

module.exports = { up, down }
