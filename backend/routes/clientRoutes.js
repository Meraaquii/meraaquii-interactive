const express = require("express");
const router = express.Router();
const {
  getClients,
  getClientSalesman,
  getSalesman,
} = require("../controllers/clientControllers.js");

router.get("/getClients", getClients);
router.post("/client/salesman", getClientSalesman);
router.get("/salesman/:clientId", getSalesman);
module.exports = router;
