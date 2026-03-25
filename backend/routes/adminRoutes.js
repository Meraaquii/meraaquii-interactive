const express = require("express");
const router = express.Router();

const {
  getClient,
  getProjects,
  getDevices,
} = require("../controllers/adminControllers");

// ROUTES
router.get("/getClients", getClient);
router.get("/getProjects", getProjects);
router.get("/getDevices", getDevices);

module.exports = router;
