const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  })
}

async function down({ context: queryInterface }) {
  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  })
}

module.exports = { up, down }
