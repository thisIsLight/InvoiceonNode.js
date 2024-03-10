module.exports = (sequelize, Sequelize) => {
    const Fulfiller = sequelize.define("fulfiller", {
        FulFillerName: {
            type: Sequelize.STRING
        }
    });
  
    return Fulfiller;
};