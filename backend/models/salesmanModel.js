const db = require("../config/database.js");

const addSalesman = async (salesmanData) => {
  const { salesman_name, salesman_phone_no, salesman_email, client_id } =
    salesmanData;

  try {
    const [existing] = await db.query(
      "SELECT * FROM mr_salesman WHERE salesman_email = ?",
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

    const values = [
      salesman_name,
      salesman_phone_no,
      salesman_email,
      client_id,
    ];

    const [result] = await db.query(query, values);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const updateSalesman = async (id, salesmanData) => {
  const { salesman_name, salesman_phone_no, salesman_email } = salesmanData;

  const query = `
    UPDATE mr_salesman 
    SET salesman_name = ?, salesman_phone_no = ?, salesman_email = ? 
    WHERE salesman_id = ?
  `;

  const values = [salesman_name, salesman_phone_no, salesman_email, id];

  const [result] = await db.query(query, values);
  return result.affectedRows;
};

const deleteSalesman = async (salesman_id) => {
  const query = "DELETE FROM mr_salesman WHERE salesman_id = ?";
  const [result] = await db.query(query, [salesman_id]);
  return result.affectedRows;
};

module.exports = { addSalesman, updateSalesman, deleteSalesman };
