'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'enable_totp', 'enable_qr');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'enable_qr', 'enable_totp');
  }
};
