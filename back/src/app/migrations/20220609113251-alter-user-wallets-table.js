async function up({ context: queryInterface }) {
  await queryInterface.renameColumn('userWallets', 'user_id', 'userId')
}

async function down({ context: queryInterface }) {
  await queryInterface.renameColumn('userWallets', 'userId', 'user_id')
}

module.exports = { up, down }
