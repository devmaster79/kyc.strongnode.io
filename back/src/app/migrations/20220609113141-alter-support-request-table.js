async function up({ context: queryInterface }) {
  await queryInterface.renameColumn('supportRequests', 'user_id', 'userId')
}

async function down({ context: queryInterface }) {
  await queryInterface.renameColumn('supportRequests', 'userId', 'user_id')
}

module.exports = { up, down }
