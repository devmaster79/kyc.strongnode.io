const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('investorDetails', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' }
    },
    investor_name: {
      type: Sequelize.STRING
    },
    investor_telegram_id: {
      type: Sequelize.STRING
    },
    investor_country: {
      type: Sequelize.STRING
    },
    investor_commitment_amount: {
      type: Sequelize.STRING
    },
    investor_wallet_address: {
      type: Sequelize.STRING
    },
    investor_email: {
      type: Sequelize.STRING
    },
    investor_fund_name: {
      type: Sequelize.STRING
    },
    investor_fund_website: {
      type: Sequelize.STRING
    },
    reviewed: {
      type: Sequelize.BOOLEAN
    },
    createdAt: {
      "type": Sequelize.DATE,
      "allowNull": false
    },
    updatedAt: {
      "type": Sequelize.DATE,
      "allowNull": false
    }
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('investorDetails');
}

module.exports = { up, down };
