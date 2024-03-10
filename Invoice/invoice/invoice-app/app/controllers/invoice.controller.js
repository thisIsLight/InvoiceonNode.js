const db = require("../models");
const Product = db.products;
const ProductDiscount = db.productdiscountmappings;
const Discount = db.discounts;
const DiscountRequirement = db.discountrequirements;
const ProductFulFiller = db.productfulfillermappings;
const ShippingRate = db.shippingrates;


//REGION - REQUIRED CLASSES
    class Invoice{
        constructor(items, subtotal, shippingCost, GST, total){
            this.cartitems = items,
            this.subtotal = subtotal,
            this.shipping = shippingCost,
            this.GST = GST,
            this.total = total
        }
    }

    class CartItem{
        constructor(productName, unitPrice, quantity, unitDiscount, subtotal, weight, savedAmount, productid){
            this.productid = productid
            this.productname = productName,
            this.quantity = quantity,
            this.unitprice = unitPrice,
            this.unitdiscount = unitDiscount,
            this.weight = weight,
            this.yousaved = savedAmount,
            this.subtotal = subtotal
        }
    }
//ENDREGION    

// REGION - PUBLIC METHODS
    exports.create = async (req, res) => {
        
        //VALIDATION
        if(!req.body.products && req.body.products.length <=0){
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }


        //PREPARING Inputs
        let orderedProductIds = new Map();
        let purchasedProducts = req.body.products;
        for(let item of purchasedProducts){
            if(orderedProductIds.has(item)){
                let currentItemCount = orderedProductIds.get(item)
                orderedProductIds.set(item, currentItemCount+1)
            }
            else{
                orderedProductIds.set(item, 1)
            }
        }


        //ORDERITEM Details
        let currentCartItems = new Array()
        await OrderItemDetails(orderedProductIds, res, currentCartItems);


        //CREAETE INVOICE MODEL
        let invoice = new Invoice(currentCartItems)


        //GST Calculation
        let totalCostWithoutDiscount = 0
        for(let item of currentCartItems){
            totalCostWithoutDiscount += (item.yousaved + item.subtotal)
        }
        invoice.GST = (totalCostWithoutDiscount*18)/100


        //SHIPPING DETAILS
        let { shippingCost, discountAmount, subtotal } = await ProcessShipping(currentCartItems, orderedProductIds, totalCostWithoutDiscount);

        //INVOICE DATA
        invoice.shipping = shippingCost - discountAmount <= 0 ? 0 : shippingCost - discountAmount
        invoice.subtotal = subtotal
        invoice.total = subtotal + invoice.shipping

        res.send(invoice);
    };
//ENDREGION


//REGION - PRIVATE METHODS
    async function ProcessShipping(currentCartItems, orderedProductIds, totalCostWithoutDiscount) {
        let subtotal = 0;
        let shippingCost = 0;
        ({ subtotal, shippingCost } = await ShippingInfo(currentCartItems, subtotal, shippingCost));

        let discountAmount = 0;
        let applicableShippingDiscount = await Discount.findAll({
            where: {
                DiscountTypeId: 2
            }
        });
        discountAmount = await GetShippingDiscount(applicableShippingDiscount, orderedProductIds, discountAmount, totalCostWithoutDiscount);
        return { shippingCost, discountAmount, subtotal };
    }

    async function OrderItemDetails(orderedProductIds, res, currentCartItems) {
        for (let product of orderedProductIds) {
            let dbResult = await Product.findAll({
                where: {
                    id: product[0]
                }
            });
            if (!dbResult || dbResult.length <= 0) {
                res.send(`${product} product doesn't exists`);
            }
            let productInfo = dbResult[0];
            let applicableDiscounts = await ProductDiscount.findAll({
                raw: true,
                where: {
                    productid: productInfo.id
                }
            });

            let discountAmount = 0;
            for (let applicableDiscount of applicableDiscounts) {
                let discount = await Discount.findAll({
                    where: {
                        id: applicableDiscount.DiscountId
                    }
                });

                if (discount[0].HasRequirements) {
                    let requirement = await DiscountRequirement.findAll({
                        where: {
                            discountid: discount[0].id
                        }
                    });
                    if (requirement[0].RequirementType == 'itemquantity') {
                        let productRequirement = requirement[0].RequirementCondition.products;
                        let conditionOperator = requirement[0].RequirementOperator;
                        let conditionOperand = requirement[0].RequirementOperand;
                        let conditionQuantity = 0;
                        for (let prod of productRequirement) {
                            if (orderedProductIds.has(prod.toString())) {
                                conditionQuantity += orderedProductIds.get(prod.toString());
                            }
                        }
                        switch (conditionOperator) {
                            case '>=':
                                if (conditionQuantity >= Number(conditionOperand)) {
                                    if (discount[0].RateTypeId == 2) {
                                        let amount = (productInfo.Price * discount[0].Rate) / 100;
                                        discountAmount += amount;
                                    }
                                    else {
                                        discountAmount += discount[0].Rate;
                                    }
                                }
                                break;
                        }
                    }
                    else if (requirement[0].requirementtype == 'cartquantity') {
                        let productRequirement = requirement[0].RequirementCondition.products;
                        let conditionOperator = requirement[0].RequirementOperator;
                        let conditionOperand = requirement[0].RequirementOperand;
                        let conditionQuantity = 0;
                        for (let prod of orderedProductIds) {
                            conditionQuantity += prod[1];
                        }
                        switch (conditionOperator) {
                            case '>=':
                                if (conditionQuantity >= conditionOperand) {
                                    if (discount[0].RateTypeId == 2) {
                                        let amount = (productInfo.Price * discount[0].Rate) / 100;
                                        discountAmount += amount;
                                    }
                                    else {
                                        discountAmount += discount[0].Rate;
                                    }
                                }
                                break;
                        }
                    }

                }
                else {
                    if (discount[0].RateTypeId == 2) {
                        let amount = (productInfo.Price * discount[0].Rate) / 100;
                        discountAmount += amount;
                    }
                    else {
                        discountAmount += discount[0].Rate;
                    }
                }
            }

            let discountedPrice = productInfo.Price - discountAmount <= 0 ? 0 : productInfo.Price - discountAmount;
            let savedAmount = discountedPrice == 0 ? productInfo.Price * product[1] : discountAmount * product[1];
            let nextCartItem = new CartItem(productInfo.ProductName, productInfo.Price, product[1],
                discountedPrice, discountedPrice * product[1], productInfo.Weight * product[1], savedAmount, productInfo.id);
            currentCartItems.push(nextCartItem);
        }
    }

    async function ShippingInfo(currentCartItems, subtotal, shippingCost) {
        for (let prod of currentCartItems) {
            subtotal += prod.subtotal;
            let fulfillerMapping = await ProductFulFiller.findAll({
                where: {
                    productid: prod.productid
                }
            });
            let fulfillerId = fulfillerMapping[0];

            let shippingRateQueryResult = await ShippingRate.findAll({
                where: {
                    fulfillerId: fulfillerId.FulFillerId
                }
            });

            let rateDetails = shippingRateQueryResult[0];
            if (rateDetails.RateTypeId == 2) {
                let amount = ((prod.weight / 100) * rateDetails.Rate) / 100;
                shippingCost += amount;
            }
            else {
                shippingCost += (prod.weight / 100) * rateDetails.Rate;
            }
        }
        return { subtotal, shippingCost };
    }

    async function GetShippingDiscount(applicableShippingDiscount, orderedProductIds, discountAmount, totalCostWithoutDiscount) {
        for (let shippingDiscount of applicableShippingDiscount) {
            if (shippingDiscount.HasRequirements) {
                let requirement = await DiscountRequirement.findAll({
                    where: {
                        discountid: shippingDiscount.id
                    }
                });
                if (requirement[0].RequirementType == 'itemquantity') {
                    let productRequirement = requirement[0].RequirementCondition.products;
                    let conditionOperator = requirement[0].RequirementOperator;
                    let conditionOperand = requirement[0].RequirementOperand;
                    let conditionQuantity = 0;
                    for (let prod of productRequirement) {
                        if (orderedProductIds.has(prod.toString())) {
                            conditionQuantity += orderedProductIds.get(prod.toString());
                        }
                    }
                    switch (conditionOperator) {
                        case '>=':
                            if (conditionQuantity >= Number(conditionOperand)) {
                                discountAmount = GetRate(shippingDiscount, totalCostWithoutDiscount, discountAmount);
                            }
                            break;
                    }
                }
                else if (requirement[0].RequirementType == 'cartquantity') {
                    let conditionOperator = requirement[0].RequirementOperator;
                    let conditionOperand = requirement[0].RequirementOperand;
                    let conditionQuantity = 0;
                    for (let prod of orderedProductIds) {
                        conditionQuantity += prod[1];
                    }
                    switch (conditionOperator) {
                        case '>=':
                            if (conditionQuantity >= conditionOperand) {
                                discountAmount = GetRate(shippingDiscount, totalCostWithoutDiscount, discountAmount);
                            }
                            break;
                    }
                }
            }
            else {
                discountAmount = GetRate(shippingDiscount, totalCostWithoutDiscount, discountAmount);
            }
        }
        return discountAmount;
    }

    function GetRate(shippingDiscount, totalCostWithoutDiscount, discountAmount) {
        if (shippingDiscount.RateTypeId == 2) {
            let amount = (totalCostWithoutDiscount * shippingDiscount.Rate) / 100;
            discountAmount += amount;
        }
        else {
            discountAmount += shippingDiscount.Rate;
        }
        return discountAmount;
    }
//ENDREGION
