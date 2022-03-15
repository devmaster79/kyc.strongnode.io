'use strict';

module.exports = {
  async up ({ context: queryInterface }) {
    await queryInterface.renameColumn('users', 'enable_totp', 'enable_qr');
  },

  async down ({ context: queryInterface }) {
    await queryInterface.renameColumn('users', 'enable_qr', 'enable_totp');
  }
};
