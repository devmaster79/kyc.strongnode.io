const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.createTable('kycEntries', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' }
    },
    documentType: {
      type: Sequelize.STRING
    },
    verificationSubject: {
      type: Sequelize.STRING
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  })
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('kycEntries')
}

module.exports = { up, down }
