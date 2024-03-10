## Run the System

Start you docker application in local
Run : `docker compose up` from readme as root
You should have a sql running on localhost:3007.
Run the below query for inserting data and use the postman endpoint in the zip to start accessing.

POSTMAN FORMAT : 

{
    {"products" : [<productIds>]}
}

NOTE : In the feed data, productids start from 1 to 6 as per the requirement document in the same order

## Init Table Values

//Insert into Products
INSERT INTO `invoice_db`.`products` (`id`, `ProductName`, `Weight`, `Price`, `TaxPercentage`, `IsDeleted`, `createdAt`, `updatedAt`) VALUES ('1', 't-shirt', '200', '999', '18', '0', NOW(), NOW());
INSERT INTO `invoice_db`.`products` (`id`, `ProductName`, `Weight`, `Price`, `TaxPercentage`, `IsDeleted`, `createdAt`, `updatedAt`) VALUES ('2', 'kurta', '100', '599', '18', '0', NOW(), NOW());
INSERT INTO `invoice_db`.`products` (`id`, `ProductName`, `Weight`, `Price`, `TaxPercentage`, `IsDeleted`, `createdAt`, `updatedAt`) VALUES ('3', 'pants', '500', '1599', '18', '0', NOW(), NOW());
INSERT INTO `invoice_db`.`products` (`id`, `ProductName`, `Weight`, `Price`, `TaxPercentage`, `IsDeleted`, `createdAt`, `updatedAt`) VALUES ('4', 'shirts', '1100', '699', '18', '0', NOW(), NOW());
INSERT INTO `invoice_db`.`products` (`id`, `ProductName`, `Weight`, `Price`, `TaxPercentage`, `IsDeleted`, `createdAt`, `updatedAt`) VALUES ('5', 'jacket', '200', '899', '18', '0', NOW(), NOW());
INSERT INTO `invoice_db`.`products` (`id`, `ProductName`, `Weight`, `Price`, `TaxPercentage`, `IsDeleted`, `createdAt`, `updatedAt`) VALUES ('6', 'T-shirt', '1300', '1899', '18', '0', NOW(), NOW());


//Insert into RateType
INSERT INTO `invoice_db`.`ratetypes` (`id`, `Type`, `createdAt`, `updatedAt`) VALUES ('1', 'absolute', NOW(), NOW());
INSERT INTO `invoice_db`.`ratetypes` (`id`, `Type`, `createdAt`, `updatedAt`) VALUES ('2', 'percentage', NOW(), NOW());


//Insert into Fulfiller
INSERT INTO `invoice_db`.`fulfillers` (`id`, `FulFillerName`, `createdAt`, `updatedAt`) VALUES ('1', 'IND', NOW(), NOW());
INSERT INTO `invoice_db`.`fulfillers` (`id`, `FulFillerName`, `createdAt`, `updatedAt`) VALUES ('2', 'US', NOW(), NOW());
INSERT INTO `invoice_db`.`fulfillers` (`id`, `FulFillerName`, `createdAt`, `updatedAt`) VALUES ('3', 'CN', NOW(), NOW());


//Insert into ShippingRates
INSERT INTO `invoice_db`.`shippingrates` (`id`, `Rate`, `createdAt`, `updatedAt`, `FulFillerId`, `RateTypeId`) VALUES ('1', '20', NOW(), NOW(), '1', '1');
INSERT INTO `invoice_db`.`shippingrates` (`id`, `Rate`, `createdAt`, `updatedAt`, `FulFillerId`, `RateTypeId`) VALUES ('2', '40', NOW(), NOW(), '2', '1');
INSERT INTO `invoice_db`.`shippingrates` (`id`, `Rate`, `createdAt`, `updatedAt`, `FulFillerId`, `RateTypeId`) VALUES ('3', '20', NOW(), NOW(), '3', '1');


//Insert into ProductFulfillerMapping
INSERT INTO `invoice_db`.`productfulfillermappings` (`id`, `createdAt`, `updatedAt`, `FulFillerId`, `ProductId`) VALUES ('1', NOW(), NOW(), '1', '1');
INSERT INTO `invoice_db`.`productfulfillermappings` (`id`, `createdAt`, `updatedAt`, `FulFillerId`, `ProductId`) VALUES ('2', NOW(), NOW(), '2', '2');
INSERT INTO `invoice_db`.`productfulfillermappings` (`id`, `createdAt`, `updatedAt`, `FulFillerId`, `ProductId`) VALUES ('3', NOW(), NOW(), '3', '3');
INSERT INTO `invoice_db`.`productfulfillermappings` (`id`, `createdAt`, `updatedAt`, `FulFillerId`, `ProductId`) VALUES ('4', NOW(), NOW(), '1', '4');
INSERT INTO `invoice_db`.`productfulfillermappings` (`id`, `createdAt`, `updatedAt`, `FulFillerId`, `ProductId`) VALUES ('5', NOW(), NOW(), '3', '5');
INSERT INTO `invoice_db`.`productfulfillermappings` (`id`, `createdAt`, `updatedAt`, `FulFillerId`, `ProductId`) VALUES ('6', NOW(), NOW(), '3', '6');


//Insert into DiscountTypes
INSERT INTO `invoice_db`.`discounttypes` (`id`, `Name`, `createdAt`, `updatedAt`) VALUES ('1', 'Product', NOW(), NOW());
INSERT INTO `invoice_db`.`discounttypes` (`id`, `Name`, `createdAt`, `updatedAt`) VALUES ('2', 'Shipping', NOW(), NOW());


//Insert into Discounts
INSERT INTO `invoice_db`.`discounts` (`id`, `DiscountName`, `Rate`, `HasRequirements`, `createdAt`, `updatedAt`, `DiscountTypeId`, `RateTypeId`) VALUES ('1', '10% Shoes', '10', '0', NOW(), NOW(), '1', '2');
INSERT INTO `invoice_db`.`discounts` (`id`, `DiscountName`, `Rate`, `HasRequirements`, `createdAt`, `updatedAt`, `DiscountTypeId`, `RateTypeId`) VALUES ('2', '50% Jackets', '50', '1', NOW(), NOW(), '1', '2');
INSERT INTO `invoice_db`.`discounts` (`id`, `DiscountName`, `Rate`, `HasRequirements`, `createdAt`, `updatedAt`, `DiscountTypeId`, `RateTypeId`) VALUES ('3', '`FLAT 100 OFF', '100', '1', NOW(), NOW(), '2', '1');


//Insert into DiscountRequirments
INSERT INTO `invoice_db`.`discountrequirements` (`id`, `RequirementType`, `RequirementOperator`, `RequirementOperand`, `RequirementCondition`, `createdAt`, `updatedAt`, `DiscountId`) VALUES ('1', 'itemquantity', '>=', '2', '{
  "products": [
    1,
    4
  ]
}', NOW(), NOW(), '2');
INSERT INTO `invoice_db`.`discountrequirements` (`id`, `RequirementType`, `RequirementOperator`, `RequirementOperand`, `RequirementCondition`, `createdAt`, `updatedAt`, `DiscountId`) VALUES ('2', 'cartquantity', '>=', '2', '{
  "products": []
}', NOW(), NOW(), '3');


//Insert into ProductDiscountRequirements
INSERT INTO `invoice_db`.`productdiscountmappings` (`id`, `createdAt`, `updatedAt`, `ProductId`, `DiscountId`) VALUES ('1', NOW(), NOW(), '6', '1');
INSERT INTO `invoice_db`.`productdiscountmappings` (`id`, `createdAt`, `updatedAt`, `ProductId`, `DiscountId`) VALUES ('2', NOW(), NOW(), '5', '2');

## Stop the System
Stopping all the running containers is also simple with a single command:
```bash
docker compose down
```

If you need to stop and remove all containers, networks, and all images used by any service in <em>docker-compose.yml</em> file, use the command:
```bash
docker compose down --rmi all
```

