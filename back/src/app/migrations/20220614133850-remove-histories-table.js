const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.removeTable('histories')
}

async function down({ context: queryInterface }) {
  await queryInterface.createTable('histories', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING
    },
    actionType: {
      type: Sequelize.DataTypes.ENUM(
        'vested',
        'earned',
        'unlocked',
        'withdrawn'
      )
    },
    tokenAmount: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATE
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  })
}

module.exports = { up, down }
