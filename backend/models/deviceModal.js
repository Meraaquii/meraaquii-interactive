const db = require("../config/database.js");

const getAlldevice = async () => {
  const query = `SELECT device_id, client_id, salesman_id, device_name, device_password, oculas_auth_id, device_status FROM mr_device`;
  const [rows] = await db.query(query);
  return rows;
};

module.exports = { getAlldevice };
