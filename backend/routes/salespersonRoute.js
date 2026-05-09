const express = require("express");
const Router = express.Router();

const {
  createSalesPerson,
  fetchAllSalesPersons,
  updateSalesPerson,
  deleteSalesPerson,
} = require("../controllers/salespersonController.js");

Router.post("/add", createSalesPerson);
Router.get("/all", fetchAllSalesPersons);
Router.put("/update/:id", updateSalesPerson);
Router.delete("/delete/:id", deleteSalesPerson);

module.exports = Router;
