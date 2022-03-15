const {Sequelize} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("investorDetails", {
        user_id: {
            type: Sequelize.INTEGER,
            references: { model: 'users', key: 'id' }
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
        reviewed: {
            type: Sequelize.BOOLEAN
        }
    });

    return User;
};
