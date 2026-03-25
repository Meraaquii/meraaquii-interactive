const db = require("../config/database.js");

const getAlldevice = async (user_id) => {
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
    JOIN mr_client c ON c.client_id = d.client_id 
    JOIN admin_user u ON u.user_email = c.client_email
    LEFT JOIN mr_salesman s ON s.salesman_id = d.salesman_id
    WHERE u.user_id = ?
  `;

  const [rows] = await db.query(query, [user_id]);
  return rows;
};

module.exports = { getAlldevice };
