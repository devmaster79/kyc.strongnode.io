async function up({ context: queryInterface }) {
  await queryInterface.renameColumn('histories', 'user_name', 'username')
  await queryInterface.renameColumn('histories', 'action_type', 'actionType')
  await queryInterface.renameColumn('histories', 'token_amount', 'tokenAmount')
}

async function down({ context: queryInterface }) {
  await queryInterface.renameColumn('histories', 'username', 'user_name')
  await queryInterface.renameColumn('histories', 'actionType', 'action_type')
  await queryInterface.renameColumn('histories', 'tokenAmount', 'token_amount')
}

module.exports = { up, down }
