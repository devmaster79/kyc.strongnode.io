module.exports = (sequelize, Sequelize) => {
    const PasswordReset = sequelize.define("passwordReset", {
        userEmail: {
            type: Sequelize.STRING
        },
        token: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.DataTypes.ENUM('active', 'inactive')
        }
    });

    return PasswordReset;
};
