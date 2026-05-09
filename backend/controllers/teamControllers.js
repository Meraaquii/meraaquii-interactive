const {
  createTeam,
  getTeams,
  getSalespersonsByTeamId,
} = require("../models/teamModel");

exports.addTeam = async (req, res) => {
  try {
    const { team_name } = req.body;

    if (!team_name) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    const result = await createTeam(team_name);

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

exports.getTeams = async (req, res) => {
  try {
    const teams = await getTeams();
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

// ✅ Fixed: changed `const` to `exports` so it's accessible from routes
exports.getSalespersonsByTeam = async (req, res) => {
  try {
    const { team_id } = req.params;

    if (!team_id) {
      return res.status(400).json({
        success: false,
        message: "Team ID is required",
      });
    }

    const data = await getSalespersonsByTeamId(team_id);

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
