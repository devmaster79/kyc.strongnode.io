const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.createTable('dashboardOrder', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' }
    },
    dashboardItem: {
      type: Sequelize.STRING
    },
    position: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true
    }
  })
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('dashboardOrder')
}

module.exports = { up, down }
