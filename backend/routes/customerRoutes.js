// customerRoutes.js
const express = require("express");
const router = express.Router();
const {
  addCustomer,
  updateCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
} = require("../controllers/customerController.js");

router.post("/addCustomer", addCustomer);
router.put("/updateCustomer/:id", updateCustomer);
router.get("/getAllCustomer", getAllCustomers);
router.get("/getAllCustomers/:id", getCustomerById);
router.delete("/deleteCustomer/:id", deleteCustomer);

module.exports = router;
