module.exports = (sequelize, Sequelize) => {
  const History = sequelize.define("history", {
    user_name: {
      type: Sequelize.STRING
    },
    action_type: {
      type: Sequelize.DataTypes.ENUM('vested', 'earned', 'unlocked', 'withdrawn')
    },
    token_amount: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATE
    }
  });

  return History;
};
