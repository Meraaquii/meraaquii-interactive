const db = require("../config/database.js");

// GET CLIENTS
const getClients = async () => {
  const [rows] = await db.query("SELECT * FROM mr_client");
  return rows;
};

// GET PROJECTS
const getProjects = async () => {
  const [rows] = await db.query("SELECT * FROM mr_project_details");
  return rows;
};

// GET DEVICES
const getDevices = async () => {
  const [rows] = await db.query("SELECT * FROM mr_device");
  return rows;
};

module.exports = {
  getClients,
  getProjects,
  getDevices,
};
