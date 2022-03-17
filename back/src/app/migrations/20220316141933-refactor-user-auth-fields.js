const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.renameColumn('users', 'enable_qr', 'enable_authenticator');
  await queryInterface.renameColumn('users', 'qr_secret', 'authenticator_qr_secret');
  await queryInterface.removeColumn('users', 'qrcode');
}

async function down({ context: queryInterface }) {
  await queryInterface.renameColumn('users', 'enable_authenticator', 'enable_qr');
  await queryInterface.renameColumn('users', 'authenticator_qr_secret', 'qr_secret');
  await queryInterface.addColumn('users', 'qrcode', Sequelize.TEXT);
}

module.exports = { up, down };
