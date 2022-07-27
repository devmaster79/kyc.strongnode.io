const { Sequelize } = require('sequelize')

/**
 *
 * @param {Object} param
 * @param {import('sequelize').QueryInterface} param.context
 */
async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'level', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'User'
  })
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'level')
}

module.exports = { up, down }
