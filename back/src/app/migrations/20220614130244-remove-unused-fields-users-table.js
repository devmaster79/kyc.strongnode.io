const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'investorName')
  await queryInterface.removeColumn('users', 'investorTelegramId')
  await queryInterface.removeColumn('users', 'investorCountry')
  await queryInterface.removeColumn('users', 'investorCommitmentAmount')
  await queryInterface.removeColumn('users', 'investorWalletAddress')
  await queryInterface.removeColumn('users', 'investorEmail')
  await queryInterface.removeColumn('users', 'investorFundName')
  await queryInterface.removeColumn('users', 'investorFundWebsite')
  await queryInterface.removeColumn('users', 'vestedAmount')
  await queryInterface.removeColumn('users', 'lockedBonusAmount')
  await queryInterface.removeColumn('users', 'earnedAmount')
  await queryInterface.removeColumn('users', 'lockedupAmount')
  await queryInterface.removeColumn('users', 'withdrawnTotalAmount')
  await queryInterface.removeColumn('users', 'remainingTotalAmount')
  await queryInterface.removeColumn('users', 'purchasedDate')
  await queryInterface.removeColumn('users', 'purchasedRound')
  await queryInterface.removeColumn('users', 'purchasedTotal')
  await queryInterface.removeColumn('users', 'investmentAmount')
}

async function down({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'investorName', Sequelize.STRING)
  await queryInterface.addColumn(
    'users',
    'investorTelegramId',
    Sequelize.STRING
  )
  await queryInterface.addColumn('users', 'investorCountry', Sequelize.STRING)
  await queryInterface.addColumn(
    'users',
    'investorCommitmentAmount',
    Sequelize.STRING
  )
  await queryInterface.addColumn(
    'users',
    'investorWalletAddress',
    Sequelize.STRING
  )
  await queryInterface.addColumn('users', 'investorEmail', Sequelize.STRING)
  await queryInterface.addColumn('users', 'investorFundName', Sequelize.STRING)
  await queryInterface.addColumn(
    'users',
    'investorFundWebsite',
    Sequelize.STRING
  )
  await queryInterface.addColumn('users', 'vestedAmount', Sequelize.STRING)
  await queryInterface.addColumn('users', 'lockedBonusAmount', Sequelize.STRING)
  await queryInterface.addColumn('users', 'earnedAmount', Sequelize.STRING)
  await queryInterface.addColumn('users', 'lockedupAmount', Sequelize.STRING)
  await queryInterface.addColumn(
    'users',
    'withdrawnTotalAmount',
    Sequelize.STRING
  )
  await queryInterface.addColumn(
    'users',
    'remainingTotalAmount',
    Sequelize.STRING
  )
  await queryInterface.addColumn('users', 'purchasedDate', Sequelize.DATE)
  await queryInterface.addColumn('users', 'purchasedRound', Sequelize.STRING)
  await queryInterface.addColumn('users', 'purchasedTotal', Sequelize.STRING)
  await queryInterface.addColumn('users', 'investmentAmount', Sequelize.STRING)
}

module.exports = { up, down }
