module.exports = (sequelize, Sequelize) => {
    const DiscountRequirement = sequelize.define("discountrequirement", {
        RequirementType: {
            type: Sequelize.STRING
        },
        RequirementOperator: {
            type: Sequelize.STRING
        },
        RequirementOperand: {
            type: Sequelize.STRING
        },
        RequirementCondition: {
            type: Sequelize.JSON
        }
    });
  
    return DiscountRequirement;
};