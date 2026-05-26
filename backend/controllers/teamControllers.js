const teamModel = require("../models/teamModel");

exports.addTeam = async (req, res) => {
  try {
    const { team_name } = req.body;

    if (!team_name) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    const result = await teamModel.createTeam(team_name);

    return res.status(201).json({
      success: true,
      message: "Team added successfully",
      data: {
        id: result.insertId,
        team_name,
      },
    });
  } catch (error) {
    console.error("Add Team Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { team_id } = req.params;
    const { team_name } = req.body;

    if (!team_id) {
      return res.status(400).json({
        success: false,
        message: "Team ID is required",
      });
    }

    if (!team_name) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    const result = await teamModel.updateTeam(team_id, team_name);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Team updated successfully",
    });
  } catch (error) {
    console.error("Update Team Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await teamModel.getTeams();

    return res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error("Get Teams Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getSalespersonsByTeam = async (req, res) => {
  try {
    const { team_id } = req.params;

    if (!team_id) {
      return res.status(400).json({
        success: false,
        message: "Team ID is required",
      });
    }

    const data = await teamModel.getSalespersonsByTeamId(team_id);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No salespersons found for this team",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching salespersons by team:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { team_id } = req.params;

    if (!team_id) {
      return res.status(400).json({
        success: false,
        message: "Team ID is required",
      });
    }

    const result = await teamModel.deleteTeam(team_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("Delete Team Error:", error);
  }
};
