async function up({ context: queryInterface }) {
  await queryInterface.renameColumn('investorDetails', 'user_id', 'userId')
  await queryInterface.renameColumn(
    'investorDetails',
    'investor_name',
    'investorName'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investor_telegram_id',
    'investorTelegramId'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investor_country',
    'investorCountry'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investor_commitment_amount',
    'investorCommitmentAmount'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investor_wallet_address',
    'investorWalletAddress'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investor_email',
    'investorEmail'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investor_fund_name',
    'investorFundName'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investor_fund_website',
    'investorFundWebsite'
  )
}

async function down({ context: queryInterface }) {
  await queryInterface.renameColumn('investorDetails', 'userId', 'user_id')
  await queryInterface.renameColumn(
    'investorDetails',
    'investorName',
    'investor_name'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investorTelegramId',
    'investor_telegram_id'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investorCountry',
    'investor_country'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investorCommitmentAmount',
    'investor_commitment_amount'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investorWalletAddress',
    'investor_wallet_address'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investorEmail',
    'investor_email'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investorFundName',
    'investor_fund_name'
  )
  await queryInterface.renameColumn(
    'investorDetails',
    'investorFundWebsite',
    'investor_fund_website'
  )
}

module.exports = { up, down }
