const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.createTable('dVPNAccess', {
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
    password: {
      type: Sequelize.STRING
    },
    access: {
      type: Sequelize.BOOLEAN
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
  await queryInterface.dropTable('dVPNAccess')
}

module.exports = { up, down }
