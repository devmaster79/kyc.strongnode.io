async function up({ context: queryInterface }) {
  await queryInterface.renameColumn('users', 'first_name', 'firstName')
  await queryInterface.renameColumn('users', 'last_name', 'lastName')
  await queryInterface.renameColumn('users', 'user_name', 'username')
  await queryInterface.renameColumn(
    'users',
    'profile_img_type',
    'profileImgType'
  )
  await queryInterface.renameColumn('users', 'profile_img_url', 'profileImgUrl')
  await queryInterface.renameColumn(
    'users',
    'profile_img_data',
    'profileImgData'
  )
  await queryInterface.renameColumn('users', 'profile_img_key', 'profileImgKey')
  await queryInterface.renameColumn('users', 'email_verified', 'emailVerified')
  await queryInterface.renameColumn('users', 'password_token', 'passwordToken')
  await queryInterface.renameColumn(
    'users',
    'authenticator_qr_secret',
    'authenticatorQrSecret'
  )
  await queryInterface.renameColumn('users', 'phone_number', 'phoneNumber')
  await queryInterface.renameColumn(
    'users',
    'enable_password',
    'enablePassword'
  )
  await queryInterface.renameColumn(
    'users',
    'enable_authenticator',
    'enableAuthenticator'
  )
  await queryInterface.renameColumn('users', 'enable_sms', 'enableSms')
  await queryInterface.renameColumn('users', 'telegram_id', 'telegramId')
  await queryInterface.renameColumn('users', 'twitter_id', 'twitterId')
  await queryInterface.renameColumn('users', 'wallet_address', 'walletAddress')
  await queryInterface.renameColumn('users', 'investor_name', 'investorName')
  await queryInterface.renameColumn(
    'users',
    'investor_telegram_id',
    'investorTelegramId'
  )
  await queryInterface.renameColumn(
    'users',
    'investor_country',
    'investorCountry'
  )
  await queryInterface.renameColumn(
    'users',
    'investor_commitment_amount',
    'investorCommitmentAmount'
  )
  await queryInterface.renameColumn(
    'users',
    'investor_wallet_address',
    'investorWalletAddress'
  )
  await queryInterface.renameColumn('users', 'investor_email', 'investorEmail')
  await queryInterface.renameColumn(
    'users',
    'investor_fund_name',
    'investorFundName'
  )
  await queryInterface.renameColumn(
    'users',
    'investor_fund_website',
    'investorFundWebsite'
  )
  await queryInterface.renameColumn('users', 'vested_amount', 'vestedAmount')
  await queryInterface.renameColumn(
    'users',
    'locked_bonus_amount',
    'lockedBonusAmount'
  )
  await queryInterface.renameColumn('users', 'earned_amount', 'earnedAmount')
  await queryInterface.renameColumn(
    'users',
    'lockedup_amount',
    'lockedupAmount'
  )
  await queryInterface.renameColumn(
    'users',
    'withdrawn_total_amount',
    'withdrawnTotalAmount'
  )
  await queryInterface.renameColumn(
    'users',
    'remaining_total_amount',
    'remainingTotalAmount'
  )
  await queryInterface.renameColumn('users', 'purchased_date', 'purchasedDate')
  await queryInterface.renameColumn(
    'users',
    'purchased_round',
    'purchasedRound'
  )
  await queryInterface.renameColumn(
    'users',
    'purchased_total',
    'purchasedTotal'
  )
  await queryInterface.renameColumn(
    'users',
    'investment_amount',
    'investmentAmount'
  )
}

async function down({ context: queryInterface }) {
  await queryInterface.renameColumn('users', 'firstName', 'first_name')
  await queryInterface.renameColumn('users', 'lastName', 'last_name')
  await queryInterface.renameColumn('users', 'username', 'user_name')
  await queryInterface.renameColumn(
    'users',
    'profileImgType',
    'profile_img_type'
  )
  await queryInterface.renameColumn('users', 'profileImgUrl', 'profile_img_url')
  await queryInterface.renameColumn(
    'users',
    'profileImgData',
    'profile_img_data'
  )
  await queryInterface.renameColumn('users', 'profileImgKey', 'profile_img_key')
  await queryInterface.renameColumn('users', 'emailVerified', 'email_verified')
  await queryInterface.renameColumn('users', 'passwordToken', 'password_token')
  await queryInterface.renameColumn(
    'users',
    'authenticatorQrSecret',
    'authenticator_qr_secret'
  )
  await queryInterface.renameColumn('users', 'phoneNumber', 'phone_number')
  await queryInterface.renameColumn(
    'users',
    'enablePassword',
    'enable_password'
  )
  await queryInterface.renameColumn(
    'users',
    'enableAuthenticator',
    'enable_authenticator'
  )
  await queryInterface.renameColumn('users', 'enableSms', 'enable_sms')
  await queryInterface.renameColumn('users', 'telegramId', 'telegram_id')
  await queryInterface.renameColumn('users', 'twitterId', 'twitter_id')
  await queryInterface.renameColumn('users', 'walletAddress', 'wallet_address')
  await queryInterface.renameColumn('users', 'investorName', 'investor_name')
  await queryInterface.renameColumn(
    'users',
    'investorTelegramId',
    'investor_telegram_id'
  )
  await queryInterface.renameColumn(
    'users',
    'investorCountry',
    'investor_country'
  )
  await queryInterface.renameColumn(
    'users',
    'investorCommitmentAmount',
    'investor_commitment_amount'
  )
  await queryInterface.renameColumn(
    'users',
    'investorWalletAddress',
    'investor_wallet_address'
  )
  await queryInterface.renameColumn('users', 'investorEmail', 'investor_email')
  await queryInterface.renameColumn(
    'users',
    'investorFundName',
    'investor_fund_name'
  )
  await queryInterface.renameColumn(
    'users',
    'investorFundWebsite',
    'investor_fund_website'
  )
  await queryInterface.renameColumn('users', 'vestedAmount', 'vested_amount')
  await queryInterface.renameColumn(
    'users',
    'lockedBonusAmount',
    'locked_bonus_amount'
  )
  await queryInterface.renameColumn('users', 'earnedAmount', 'earned_amount')
  await queryInterface.renameColumn(
    'users',
    'lockedupAmount',
    'lockedup_amount'
  )
  await queryInterface.renameColumn(
    'users',
    'withdrawnTotalAmount',
    'withdrawn_total_amount'
  )
  await queryInterface.renameColumn(
    'users',
    'remainingTotalAmount',
    'remaining_total_amount'
  )
  await queryInterface.renameColumn('users', 'purchasedDate', 'purchased_date')
  await queryInterface.renameColumn(
    'users',
    'purchasedRound',
    'purchased_round'
  )
  await queryInterface.renameColumn(
    'users',
    'purchasedTotal',
    'purchased_total'
  )
  await queryInterface.renameColumn(
    'users',
    'investmentAmount',
    'investment_amount'
  )
}

module.exports = { up, down }
