module.exports = (sequelize, Sequelize) => {
    const Discount = sequelize.define("discount", {
        DiscountName: {
            type: Sequelize.STRING
        },
        Rate: {
            type: Sequelize.FLOAT
        },
        HasRequirements: {
            type: Sequelize.BOOLEAN
        }
    });
  
    return Discount;
};