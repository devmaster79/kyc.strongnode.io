const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.createTable('supportRequests', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' }
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: true
    },
    message: {
      type: Sequelize.STRING,
      allowNull: true
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
  await queryInterface.dropTable('supportRequests')
}

module.exports = { up, down }
