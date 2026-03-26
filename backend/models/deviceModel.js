const db = require("../config/database.js");

const getAlldevice = async (client_id) => {
  const query = `
  SELECT 
    d.device_id, 
    d.client_id, 
    d.salesman_id, 
    d.device_name, 
    d.device_password, 
    d.oculas_auth_id, 
    d.device_status,
    c.client_name,
    s.salesman_name
  FROM mr_device d
  LEFT JOIN mr_client c ON c.client_id = d.client_id 
  LEFT JOIN mr_salesman s ON s.salesman_id = d.salesman_id
  WHERE d.client_id = ?
`;

  const [rows] = await db.query(query, [client_id]);
  return rows;
};

const UpdateDevice = async (deviceData) => {
  const {
    device_id,
    client_id,
    salesman_id,
    device_name,
    device_password,
    oculas_auth_id,
    device_status,
  } = deviceData;

  const query = `
    UPDATE mr_device
    SET 
      client_id = ?,
      salesman_id = ?,
      device_name = ?,
      device_password = ?,
      oculas_auth_id = ?,
      device_status = ?
    WHERE device_id = ?
  `;

  const [result] = await db.query(query, [
    client_id,
    salesman_id,
    device_name,
    device_password,
    oculas_auth_id,
    device_status,
    device_id,
  ]);

  return result;
};

module.exports = { getAlldevice, UpdateDevice };
