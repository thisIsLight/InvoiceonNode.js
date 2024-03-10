module.exports = app => {
    const invoice = require("../controllers/invoice.controller.js");
  
    var router = require("express").Router();
  
    // Create an invoice
    router.post("/create", invoice.create);
  
    app.use('/api/invoice', router);
  };