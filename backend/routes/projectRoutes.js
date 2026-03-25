const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
} = require("../controllers/projectControllers.js");

router.get("/getProjects", getProjects);
router.get("/getProjectById/:id", getProjectById);

module.exports = router;
