module.exports = (sequelize, Sequelize) => {
  const History = sequelize.define("history", {
    user_name: {
      type: Sequelize.STRING
    },
    action_type: {
      type: DataTypes.ENUM('vested', 'earned', 'unlocked', 'withdrawn')
    },
    token_account: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATE
    }
  });

  return History;
};
