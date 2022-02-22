const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('histories', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_name: {
      type: Sequelize.STRING
    },
    action_type: {
      type: Sequelize.DataTypes.ENUM('vested', 'earned', 'unlocked', 'withdrawn')
    },
    token_amount: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATE
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('histories');
}

module.exports = { up, down };
