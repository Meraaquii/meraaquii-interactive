// customerModels.js
const db = require("../config/database.js");

const AddCustomer = async (customerData) => {
  const trimmed = Object.fromEntries(
    Object.entries(customerData).map(([k, v]) => [k.trim(), v]),
  );

  const {
    customer_name,
    customer_phone_no,
    customer_email,
    customer_address,
    clientId,
    client_id,
    salesman_id,
  } = trimmed;

  const resolvedClientId = client_id ?? clientId;

  if (!resolvedClientId) throw new Error("client_id is required");
  if (!customer_name) throw new Error("customer_name is required");
  if (!customer_phone_no) throw new Error("customer_phone_no is required");
  if (!customer_email) throw new Error("customer_email is required");

  const [existing] = await db.query(
    `SELECT * FROM mr_customer WHERE cus_email = ?`,
    [customer_email],
  );
  if (existing.length > 0) throw new Error("Email already exists");

  const [result] = await db.query(
    `INSERT INTO mr_customer 
     (cus_name, cus_phone, cus_email, cus_address, client_id, salesman_id) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      customer_name,
      customer_phone_no,
      customer_email,
      customer_address,
      resolvedClientId,
      salesman_id,
    ],
  );

  return result;
};

const updateCustomer = async (customerId, customerData) => {
  const { customer_name, customer_phone_no, customer_email, customer_address } =
    customerData;

  const [result] = await db.query(
    `UPDATE mr_customer 
     SET cus_name = ?, cus_phone = ?, cus_email = ?, cus_address = ?
     WHERE cus_id = ?`,
    [
      customer_name,
      customer_phone_no,
      customer_email,
      customer_address,
      customerId,
    ],
  );

  return result;
};

const getCustomers = async (userId) => {
  try {
    const query = `
      SELECT c.*
      FROM mr_customer c
      JOIN mr_salesman s ON c.salesman_id = s.salesman_id
      WHERE s.user_id = ?
    `;

    const [rows] = await db.query(query, [userId]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getCustomerById = async (customerId) => {
  const [rows] = await db.query(`SELECT * FROM mr_customer WHERE cus_id = ?`, [
    customerId,
  ]);
  return rows[0];
};

const deleteCustomer = async (customerId) => {
  const [result] = await db.query(`DELETE FROM mr_customer WHERE cus_id = ?`, [
    customerId,
  ]);
  return result;
};

module.exports = {
  AddCustomer,
  updateCustomer,
  getCustomers,
  getCustomerById,
  deleteCustomer,
};
