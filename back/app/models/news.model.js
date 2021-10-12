module.exports = (sequelize, Sequelize) => {
  const News = sequelize.define("news", {
    logo: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.DataTypes.ENUM('active', 'inactive')
    }
  });

  return News;
};