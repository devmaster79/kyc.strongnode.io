const {Sequelize} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const supportRequest = sequelize.define("supportRequests", {
        user_id: {
            type: Sequelize.INTEGER,
            references: { model: 'users', key: 'id' }
        },
        subject: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.STRING,
        }
    });

    return supportRequest;
};
