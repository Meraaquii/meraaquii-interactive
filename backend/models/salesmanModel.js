const db = require("../config/database.js");
const bcrypt = require("bcrypt");

const generatePassword = () => {
  const random = Math.floor(100 + Math.random() * 900);
  return `Device@${random}`;
};

const generateUniqueOculusAuthId = async (connection) => {
  let oculas_auth_id;
  let exists = true;
  while (exists) {
    oculas_auth_id = Math.floor(100 + Math.random() * 900).toString();
    const [rows] = await connection.query(
      "SELECT * FROM mr_device WHERE oculas_auth_id = ?",
      [oculas_auth_id],
    );
    if (rows.length === 0) exists = false;
  }
  return oculas_auth_id;
};

//GET ALL
const getAllSalesman = async (user_email, user_type, user_id) => {
  let query = `
    SELECT DISTINCT
      pm.project_id,
      pd.project_name,
      t.tower_name,
      f.floor_name,
      a.appartment_id AS apart_id,
      a.apart_name    AS apartment_name,
      a.appartment_available,
      c.client_name,
      c.client_email,
      pm.project_status,
      pm.created_on,
      ft.flat_type_name,
      sm.salesman_name,
      sm.salesman_email
    FROM mr_project_master pm
    LEFT JOIN mr_project_details pd ON pd.project_id = pm.project_id
    LEFT JOIN mr_client         c  ON c.client_id   = pm.client_id
    LEFT JOIN mr_tower_master   t  ON t.project_id  = pm.project_id
    LEFT JOIN mr_floor_master   f  ON f.tower_id    = t.tower_id
    LEFT JOIN mr_appartment_master a ON a.floor_id  = f.floor_id
    LEFT JOIN mr_flat_type      ft ON ft.flat_type_id = a.flat_type_id
    LEFT JOIN mr_salesman       sm ON sm.client_id  = pm.client_id
  `;

  const conditions = [];
  const params = [];

  if (user_type === "S" && user_id) {
    conditions.push("sm.user_id = ?");
    params.push(user_id);
  }
  if (user_email) {
    conditions.push("c.client_email = ?");
    params.push(user_email);
  }
  if (conditions.length > 0) query += " WHERE " + conditions.join(" AND ");

  const [rows] = await db.query(query, params);
  return rows;
};

// ADD
const addSalesman = async (salesmanData) => {
  const { salesman_name, salesman_phone_no, salesman_email, client_id } =
    salesmanData;

  if (!salesman_name || !salesman_phone_no || !salesman_email || !client_id) {
    throw new Error("All fields are required");
  }

  const [existing] = await db.query(
    "SELECT salesman_id FROM mr_salesman WHERE salesman_email = ?",
    [salesman_email],
  );

  if (existing.length > 0) {
    throw new Error("Email already exists");
  }

  const query = `
    INSERT INTO mr_salesman 
    (salesman_name, salesman_phone_no, salesman_email, client_id) 
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    salesman_name,
    salesman_phone_no,
    salesman_email,
    client_id,
  ]);

  return result.insertId;
};

// UPDATE
const updateSalesman = async (id, salesmanData) => {
  const { salesman_name, salesman_phone_no, salesman_email } = salesmanData;

  if (!salesman_name || !salesman_phone_no || !salesman_email) {
    throw new Error("All fields are required");
  }

  const [existing] = await db.query(
    "SELECT salesman_id FROM mr_salesman WHERE salesman_id = ?",
    [id],
  );

  if (existing.length === 0) {
    return 0;
  }

  const [duplicate] = await db.query(
    "SELECT salesman_id FROM mr_salesman WHERE salesman_email = ? AND salesman_id != ?",
    [salesman_email, id],
  );

  if (duplicate.length > 0) {
    throw new Error("Email already exists");
  }

  const [result] = await db.query(
    `UPDATE mr_salesman 
     SET salesman_name = ?, salesman_phone_no = ?, salesman_email = ?
     WHERE salesman_id = ?`,
    [salesman_name, salesman_phone_no, salesman_email, id],
  );

  return result.affectedRows;
};

// DELETE
const deleteSalesman = async (salesman_id) => {
  const [existing] = await db.query(
    "SELECT salesman_id FROM mr_salesman WHERE salesman_id = ?",
    [salesman_id],
  );

  if (existing.length === 0) {
    return 0;
  }

  const [result] = await db.query(
    "DELETE FROM mr_salesman WHERE salesman_id = ?",
    [salesman_id],
  );

  return result.affectedRows;
};

module.exports = {
  addSalesman,
  getAllSalesman,
  updateSalesman,
  deleteSalesman,
};
