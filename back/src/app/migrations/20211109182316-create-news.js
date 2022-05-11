const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.createTable('news', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    logo: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
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
  await queryInterface.dropTable('news')
}

module.exports = { up, down }
