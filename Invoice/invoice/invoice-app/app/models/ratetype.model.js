module.exports = (sequelize, Sequelize) => {
    const RateType = sequelize.define("ratetype", {
        Type: {
            type: Sequelize.STRING
        }
    });
  
    return RateType;
};