const express = require("express");
const Router = express.Router();

const {
  getAllSalesman,
  createSalesman,
  updateSalesman,
  deleteSalesman,
} = require("../controllers/salesmanControllers.js");

const { getSalesman } = require("../controllers/clientControllers.js");

Router.get("/list", getAllSalesman);
Router.get("/client/:clientId", getSalesman);
Router.post("/AddSalesman", createSalesman);
Router.put("/UpdateSalesman/:id", updateSalesman);
Router.delete("/DeleteSalesman/:id", deleteSalesman);

module.exports = Router;
