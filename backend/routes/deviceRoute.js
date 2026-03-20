const express = require("express");
const router = express.Router();
const { getDevice } = require("../controllers/deviceControllers.js");

router.get("/getDevices", getDevice);

module.exports = router;
