const db = require("../config/database.js");

const addSalesPerson = async (salespersonData) => {
  const {
    salesperson_name,
    salesperson_phone,
    salesperson_email,
    client_id,
    team_name,
    user_id,
  } = salespersonData;

  // Validation
  if (
    !salesperson_name ||
    !salesperson_phone ||
    !salesperson_email ||
    !team_name
  ) {
    throw new Error("All fields are required");
  }

  // Check existing email
  const [existing] = await db.query(
    "SELECT salesperson_id FROM mr_salesperson WHERE salesperson_email = ?",
    [salesperson_email],
  );

  if (existing.length > 0) {
    throw new Error("Email already exists");
  }

  // Insert query
  const query = `
    INSERT INTO mr_salesperson 
    (salesperson_name, salesperson_phone, salesperson_email, client_id, team_name, user_id) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    salesperson_name,
    salesperson_phone,
    salesperson_email,
    client_id,
    team_name,
    user_id,
  ]);

  return result.insertId;
};

const getAllSalesPersons = async () => {
  try {
    const query = `
      SELECT 
        salesperson_id,
        salesperson_name,
        salesperson_phone,
        salesperson_email,
        client_id,
        team_name,
        user_id,
        created_at
       
      FROM mr_salesperson
      ORDER BY salesperson_id DESC
    `;

    const [salespersons] = await db.query(query);

    return salespersons;
  } catch (error) {
    console.error("Error fetching salespersons:", error.message);
    throw error;
  }
};

const updateSalesPerson = async (salesperson_id, salespersonData) => {
  try {
    const {
      salesperson_name,
      salesperson_phone,
      salesperson_email,
      team_name,
    } = salespersonData;

    // Validation
    if (
      !salesperson_name ||
      !salesperson_phone ||
      !salesperson_email ||
      !team_name
    ) {
      throw new Error("All fields are required");
    }

    // Check duplicate email
    const [existing] = await db.query(
      `SELECT salesperson_id FROM mr_salesperson
       WHERE salesperson_email = ? AND salesperson_id != ?`,
      [salesperson_email, salesperson_id],
    );

    if (existing.length > 0) {
      throw new Error("Email already exists");
    }

    // Fetch existing row to preserve client_id and user_id
    const [rows] = await db.query(
      `SELECT client_id, user_id FROM mr_salesperson WHERE salesperson_id = ?`,
      [salesperson_id],
    );

    if (rows.length === 0) {
      throw new Error("Salesperson not found");
    }

    const { client_id, user_id } = rows[0]; // preserve existing values

    // Update query
    const query = `
      UPDATE mr_salesperson
      SET 
        salesperson_name = ?,
        salesperson_phone = ?,
        salesperson_email = ?,
        client_id = ?,
        team_name = ?,
        user_id = ?
      WHERE salesperson_id = ?
    `;

    const [result] = await db.query(query, [
      salesperson_name,
      salesperson_phone,
      salesperson_email,
      client_id, // from existing DB row
      team_name,
      user_id, // from existing DB row
      salesperson_id,
    ]);

    return result;
  } catch (error) {
    console.error("Update Salesperson Error:", error.message);
    throw error;
  }
};

const deleteSalesPerson = async (salesperson_id) => {
  try {
    const query = `DELETE FROM mr_salesperson WHERE salesperson_id = ?`;
    const [result] = await db.query(query, [salesperson_id]);
    return result;
  } catch (error) {
    console.error("Delete Salesperson Error:", error.message);
    throw error;
  }
};

module.exports = {
  addSalesPerson,
  getAllSalesPersons,
  updateSalesPerson,
  deleteSalesPerson,
};
