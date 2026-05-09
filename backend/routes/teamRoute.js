const express = require("express");
const router = express.Router();

const {
  addTeam,
  getTeams,
  getSalespersonsByTeam,
} = require("../controllers/teamControllers.js");

// Add Team API
router.post("/add-team", addTeam);
router.get("/get-teams", getTeams);
router.get("/team/:team_id", getSalespersonsByTeam);

module.exports = router;
