const pool = require("../config/database");

// Find user by email
const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM admin_user WHERE user_email = ? LIMIT 1",
    [email],
  );
  return rows[0];
};

// Create new user
const createUser = async (userData) => {
  const {
    user_type,
    user_name,
    user_password,
    user_email,
    user_no,
    user_contact_no,
    user_address,
  } = userData;

  const [result] = await pool.query(
    `INSERT INTO admin_user
    (user_type, user_name, user_password, user_status, user_email, user_no, user_contact_no, user_address, login_otp)
    VALUES (?, ?, ?, 'I', ?, ?, ?, ?, 0)`,
    [
      user_type,
      user_name,
      user_password,
      user_email,
      user_no,
      user_contact_no,
      user_address,
    ],
  );

  return result.insertId;
};

// Activate user

const activateUser = async (email) => {
  const [result] = await pool.query(
    "UPDATE admin_user SET user_status = 'A' WHERE TRIM(user_email) = ?",
    [email],
  );

  return result.affectedRows;
};

module.exports = {
  findUserByEmail,
  createUser,
  activateUser,
};
