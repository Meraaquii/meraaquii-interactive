const db = require("../config/database");

const checkExistingBookingModel = async (apartment_id, booking_date) => {
  const query = `
    SELECT *
    FROM mr_project_filters
    WHERE apartment_id = ?
    AND booking_date = ?
    AND status = 'ACTIVE'
  `;

  const [rows] = await db.query(query, [apartment_id, booking_date]);

  return rows;
};

const createProjectFilterModel = async ({
  team_id,
  salesperson_id,
  apartment_id,
  booking_date,
  remarks,
}) => {
  const [year, month, day] = booking_date.split("-").map(Number);

  const bookingDateObj = new Date(year, month - 1, day);

  const expiresAt = new Date(bookingDateObj.getTime() + 24 * 60 * 60 * 1000);

  const formattedExpiresAt =
    expiresAt.getFullYear() +
    "-" +
    String(expiresAt.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(expiresAt.getDate()).padStart(2, "0") +
    " " +
    String(expiresAt.getHours()).padStart(2, "0") +
    ":" +
    String(expiresAt.getMinutes()).padStart(2, "0") +
    ":" +
    String(expiresAt.getSeconds()).padStart(2, "0");

  console.log("BOOKING DATE:", booking_date);

  console.log("EXPIRES:", formattedExpiresAt);

  const query = `
    INSERT INTO mr_project_filters
    (
      team_id,
      salesperson_id,
      apartment_id,
      booking_date,
      remarks,
      expires_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    team_id,
    salesperson_id,
    apartment_id,
    booking_date,
    remarks,
    formattedExpiresAt,
  ]);

  return result;
};

const getExpiredBookingsModel = async () => {
  const query = `
    SELECT *
    FROM mr_project_filters
    WHERE status = 'ACTIVE'
    AND expires_at <= NOW()
  `;

  const [rows] = await db.query(query);

  return rows;
};

const updateFilterStatusModel = async (filter_id, status) => {
  const query = `
    UPDATE mr_project_filters
    SET status = ?
    WHERE filter_id = ?
  `;

  const [result] = await db.query(query, [status, filter_id]);

  return result;
};

module.exports = {
  checkExistingBookingModel,
  createProjectFilterModel,
  getExpiredBookingsModel,
  updateFilterStatusModel,
};
