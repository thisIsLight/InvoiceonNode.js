require("dotenv").config();
const express = require("express");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());


const db = require("./app/models");

db.sequelize.sync();

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Invoicing application." });
});

require("./app/routes/invoice.routes")(app);


const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Working...`);
});
