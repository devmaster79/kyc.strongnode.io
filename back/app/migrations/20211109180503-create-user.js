'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     * Add column
     * await queryInterface.addColumn( 'Users', 'email', Sequelize.STRING );
     */
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      user_name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      profile_img_type: {
        type: Sequelize.STRING
      },
      profile_img_url: {
        type: Sequelize.STRING
      },
      profile_img_data: {
        type: Sequelize.BLOB("long")
      },
      profile_img_key: {
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
      enable_sms: {
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
      },
      vested_amount: {
        type: Sequelize.STRING
      },
      locked_bonus_amount: {
        type: Sequelize.STRING
      },
      earned_amount: {
        type: Sequelize.STRING
      },
      lockedup_amount: {
        type: Sequelize.STRING
      },
      withdrawn_total_amount: {
        type: Sequelize.STRING
      },
      remaining_total_amount: {
        type: Sequelize.STRING
      },
      purchased_date: {
        type: Sequelize.DATE
      },
      purchased_round: {
        type: Sequelize.STRIN
      },
      purchased_total: {
        type: Sequelize.STRING
      },
      investment_amount: {
        type: Sequelize.STRING
      },
      createdAt: {
        "type": Sequelize.DATE,
        "allowNull": false
      }
    });
    /**
     *
     */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     * Add Column
     * await queryInterface.removeColumn( 'Users', 'email' );
     */
    await queryInterface.dropTable('users');
  }
};
