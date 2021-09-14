module.exports = (sequelize, Sequelize) => {
    const News = sequelize.define("history", {
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
        type: DataTypes.ENUM('active', 'inactive')
      }
    });
  
    return News;
  };
  