const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('coinChartData', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: Sequelize.STRING,
      allowNull: true
    },
    scope: {
      type: Sequelize.STRING,
      allowNull: true
    },
    data: {
      type: Sequelize.JSON,
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
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('coinChartData');
}

module.exports = { up, down };
