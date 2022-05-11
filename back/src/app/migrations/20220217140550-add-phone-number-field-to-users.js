const { Sequelize } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'phone_number', Sequelize.STRING)
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'phone_number')
  }
}
