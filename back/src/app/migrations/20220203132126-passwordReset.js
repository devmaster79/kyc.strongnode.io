const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.createTable('passwordReset', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userEmail: {
      type: Sequelize.STRING
    },
    token: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.DataTypes.ENUM('active', 'inactive')
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  })
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('passwordReset')
}

module.exports = { up, down }
