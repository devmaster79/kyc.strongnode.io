const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'enable_password', Sequelize.BOOLEAN);
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'enable_password' );
}

module.exports = { up, down };
