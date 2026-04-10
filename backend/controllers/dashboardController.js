const {
  getDashboardData,
  getProjectDetails,
} = require("../models/clientDashboardModel.js");

const getClientDashboard = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const data = await getDashboardData(clientId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getClientProjectDetails = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res
        .status(400)
        .json({ success: false, message: "Client ID is required" });
    }

    const data = await getProjectDetails(clientId);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Project Details Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getClientDashboard, getClientProjectDetails };
