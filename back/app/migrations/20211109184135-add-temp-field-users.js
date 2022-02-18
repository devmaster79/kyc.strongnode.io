const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'temp', Sequelize.STRING );
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'temp' );
}

module.exports = { up, down };
