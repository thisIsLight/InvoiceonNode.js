module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
      ProductName: {
        type: Sequelize.STRING
      },
      Weight: {
        type: Sequelize.FLOAT
      },
      Price: {
        type: Sequelize.FLOAT
      },
      TaxPercentage: {
        type: Sequelize.FLOAT
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Product;
  };
  