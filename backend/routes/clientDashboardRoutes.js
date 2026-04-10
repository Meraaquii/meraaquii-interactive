const express = require("express");
const router = express.Router();
const {
  getClientDashboard,
  getClientProjectDetails,
} = require("../controllers/dashboardController");

router.get("/:clientId", getClientDashboard);
router.get("/:clientId/project-details", getClientProjectDetails);

module.exports = router;
