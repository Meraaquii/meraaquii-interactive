const express = require("express");
const router = express.Router();
const {
  getDevicesByClient,
  UpdateDevice,
} = require("../controllers/deviceControllers.js");

router.get("/devices/:client_id", getDevicesByClient);
router.put("/updateDevice", UpdateDevice);

module.exports = router;
