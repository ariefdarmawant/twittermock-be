module.exports = (sequelize, Sequelize) => {
    const Tweet = sequelize.define("tweets", {
      text:{
        type: Sequelize.STRING(240)
      },
      parentId: {
        type: Sequelize.INTEGER
      }
    });
  
    return Tweet;
  };