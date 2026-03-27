const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
  updateApartmentStatus,
} = require("../controllers/projectControllers.js");

router.get("/getProjects", getProjects);
router.get("/getProjectById/:id", getProjectById);
router.put("/apartment-status", updateApartmentStatus);

module.exports = router;
