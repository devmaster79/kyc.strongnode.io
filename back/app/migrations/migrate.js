module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      "id": {
        "type": Sequelize.INTEGER,
        "field": "id",
        "autoIncrement": true,
        "primaryKey": true,
        "allowNull": false
      },
      "first_name": {
        "type": Sequelize.STRING,
        "field": "first_name",
        "allowNull": false
      },
      "last_name": {
        "type": Sequelize.STRING,
        "field": "last_name",
        "allowNull": false
      },
      "email": {
        "type": Sequelize.STRING,
        "field": "email",
        "unique": true,
        "allowNull": false
      },
      "user_name": {
          "type": Sequelize.STRING,
          "field": "user_name",
          "unique": true,
          "allowNull": false
      },
      "profile_img_type": {
          "type": Sequelize.STRING,
          "field": "profile_img_type"
      },
      "profile_img_url": {
        "type": Sequelize.STRING,
        "field": "profile_img_url"
      },
      "profile_img_data": {
        "type": Sequelize.BLOB("long"),
        "field": "profile_img_data"
      },
      "profile_img_key": {
        type: Sequelize.STRING,
        "field": "profile_img_key"
      },
      "email_verified": {
        type: Sequelize.BOOLEAN,
        "field": "email_verified"
      },
      "token": {
        type: Sequelize.STRING,
        "field": "token"
      },
      "password_token": {
        type: Sequelize.STRING,
        "field": "password_token"
      },
      "password": {
        type: Sequelize.STRING,
        "field": "password"
      },
      "smscode": {
        type: Sequelize.STRING,
        "field": "smscode"
      },
      "qr_secret": {
        type: Sequelize.STRING,
        "field": "qr_secret"
      },
      "qrcode": {
        type: Sequelize.TEXT,
        "field": "qrcode"
      },
      "enable_totp": {
        type: Sequelize.BOOLEAN,
        "field": "enable_totp"
      },
      "enable_sms": {
        type: Sequelize.BOOLEAN,
        "field": "enable_sms"
      },
      "telegram_id": {
        type: Sequelize.STRING,
        "field": "telegram_id"
      },
      "twitter_id": {
        type: Sequelize.STRING,
        "field": "twitter_id"
      },
      "wallet_address": {
        type: Sequelize.STRING,
        "field": "wallet_address"
      },
      "investor_name": {
        type: Sequelize.STRING,
        "field": "investor_name"
      },
      "investor_telegram_id": {
        type: Sequelize.STRING,
        "field": "investor_telegram_id"
      },
      "investor_country": {
        type: Sequelize.STRING,
        "field": "investor_country"
      },
      "investor_commitment_amount": {
        type: Sequelize.STRING,
        "field": "investor_commitment_amount"
      },
      "investor_wallet_address": {
        type: Sequelize.STRING,
        "field": "investor_wallet_address"
      },
      "investor_email": {
        type: Sequelize.STRING,
        "field": "investor_email"
      },
      "investor_fund_name": {
        type: Sequelize.STRING,
        "field": "investor_fund_name"
      },
      "investor_fund_website": {
        type: Sequelize.STRING,
        "field": "investor_fund_website"
      },
      "vested_amount": {
        type: Sequelize.STRING,
        "field": "vested_amount"
      },
      "locked_bonus_amount": {
        type: Sequelize.STRING,
        "field": "locked_bonus_amount"
      },
      "earned_amount": {
        type: Sequelize.STRING,
        "field": "earned_amount"
      },
      "lockedup_amount": {
        type: Sequelize.STRING,
        "field": "lockedup_amount"
      },
      "withdrawn_total_amount": {
        type: Sequelize.STRING,
        "field": "withdrawn_total_amount"
      },
      "remaining_total_amount": {
        type: Sequelize.STRING,
        "field": "remaining_total_amount"
      },
      "purchased_date": {
        type: Sequelize.DATE,
        "field": "purchased_date"
      },
      "purchased_round": {
        type: Sequelize.STRING,
        "field": "purchased_round"
      },
      "purchased_total": {
        type: Sequelize.STRING,
        "field": "purchased_total"
      },
      "investment_amount": {
        type: Sequelize.STRING,
        "field": "purchased_total"
      },
      "createdAt": {
          "type": Sequelize.DATE,
          "field": "createdAt",
          "allowNull": false
      }
  });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};