const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.createTable('dVPNUsage', {
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
    bytesIn: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    bytesOut: {
      type: Sequelize.DOUBLE,
      allowNull: false
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
  await queryInterface.dropTable('dVPNUsage')
}

module.exports = { up, down }
