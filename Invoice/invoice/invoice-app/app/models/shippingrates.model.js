module.exports = (sequelize, Sequelize) => {
    const ShippingRates = sequelize.define("shippingrates", {
        Rate: {
            type: Sequelize.FLOAT
        }
    });
  
    return ShippingRates;
};