'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'phone_number', Sequelize.STRING );
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('users', 'phone_number' );
  }
};
