const db = require("../config/database.js");

const getClientUser = async () => {
  const [rows] = await db.query(
    "SELECT * FROM mr_client WHERE user_type = 'C'",
  );
  return rows;
};

const getSalesmanByClient = async (clientId) => {
  const query = `
    SELECT salesman_id, salesman_name, salesman_phone_no, salesman_email
    FROM mr_salesman
    WHERE client_id = ?
  `;

  const [rows] = await db.query(query, [clientId]);
  return rows;
};

const getAllSalesman = async () => {
  const query = `
    SELECT salesman_id, salesman_name, salesman_phone_no, salesman_email, client_id, created_on
    FROM mr_salesman
  `;

  const [rows] = await db.query(query);
  return rows;
};
module.exports = { getClientUser, getSalesmanByClient, getAllSalesman };
