const {
  getClients,
  getProjects: getProjectsModel,
  getDevices: getDevicesModel,
} = require("../models/adminModel.js");

// GET CLIENTS
const getClient = async (req, res) => {
  try {
    const clients = await getClients();

    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await getProjectsModel();

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET DEVICES
const getDevices = async (req, res) => {
  try {
    const devices = await getDevicesModel();

    res.json({
      success: true,
      data: devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getClient,
  getProjects,
  getDevices,
};
