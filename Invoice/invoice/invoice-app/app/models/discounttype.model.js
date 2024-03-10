module.exports = (sequelize, Sequelize) => {
    const DiscountType = sequelize.define("discounttype", {
        Name: {
            type: Sequelize.STRING
        }
    });
  
    return DiscountType;
};