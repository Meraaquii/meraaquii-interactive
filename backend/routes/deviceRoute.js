const express = require("express");
const router = express.Router();
const { getDevicesByClient } = require("../controllers/deviceControllers.js");

router.get("/devices/:client_id", getDevicesByClient);
module.exports = router;
