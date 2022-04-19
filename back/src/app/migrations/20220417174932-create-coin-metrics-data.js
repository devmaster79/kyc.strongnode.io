const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('coinMetricsData', {
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
    image: {
      type: Sequelize.JSON,
      allowNull: true
    },
    usd_value: {
      type: Sequelize.DECIMAL(30, 10),
      allowNull: true
    },
    market_cap: {
      type: Sequelize.DECIMAL(30, 10),
      allowNull: true
    },
    day_volume: {
      type: Sequelize.DECIMAL(30, 10),
      allowNull: true
    },
    day_change: {
      type: Sequelize.DECIMAL(30, 10),
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
  await queryInterface.dropTable('coinMetricsData');
}

module.exports = { up, down };
