module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    user_name: {
      type: Sequelize.STRING
    },
    email_verified: {
      type: Sequelize.BOOLEAN
    },
    token: {
      type: Sequelize.STRING
    },
    password_token: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    smscode: {
      type: Sequelize.STRING
    },
    qr_secret: {
      type: Sequelize.STRING
    },
    qrcode: {
      type: Sequelize.TEXT
    },
    enable_totp: {
      type: Sequelize.BOOLEAN
    },
    telegram_id: {
      type: Sequelize.STRING
    },
    twitter_id: {
      type: Sequelize.STRING
    },
    wallet_address: {
      type: Sequelize.STRING
    },
    investor_name: {
      type: Sequelize.STRING
    },
    investor_telegram_id: {
      type: Sequelize.STRING
    },
    investor_country: {
      type: Sequelize.STRING
    },
    investor_commitment_amount: {
      type: Sequelize.STRING
    },
    investor_wallet_address: {
      type: Sequelize.STRING
    },
    investor_email: {
      type: Sequelize.STRING
    },
    investor_fund_name: {
      type: Sequelize.STRING
    },
    investor_fund_website: {
      type: Sequelize.STRING
    }
  });

  return User;
};
