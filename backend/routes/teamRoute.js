const express = require("express");
const router = express.Router();

const {
  addTeam,
  getTeams,
  updateTeam,
  getSalespersonsByTeam,
  deleteTeam,
} = require("../controllers/teamControllers.js");

// Add Team API
router.post("/add-team", addTeam);
router.put("/update-team/:team_id", updateTeam);
router.get("/get-teams", getTeams);
router.get("/team/:team_id", getSalespersonsByTeam);
router.delete("/delete-team/:team_id", deleteTeam);

module.exports = router;
