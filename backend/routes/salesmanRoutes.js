const express = require("express");

const Router = express.Router();

const {
  createSalesman,
  updateSalesman,
  deleteSalesman,
} = require("../controllers/salesmanControllers.js");

Router.post("/addSalesman", createSalesman);
Router.put("/updateSalesman/:id", updateSalesman);
Router.delete("/deleteSalesman/:id", deleteSalesman);

module.exports = Router;
