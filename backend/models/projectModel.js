const db = require("../config/database.js");

// const getAllProjects = async () => {
//   const query = `SELECT * FROM mr_project_details`;
//   const [rows] = await db.execute(query);
//   return rows;
// };

const getAllProjects = async (user_email, user_type) => {
  let query = `
    SELECT
      pm.project_id,
      pd.project_name,
      t.tower_name,
      f.floor_name,
      a.appartment_id AS apart_id,       -- ✅ correct column name, aliased
      a.apart_name AS apartment_name,
      a.appartment_available,
      c.client_name,
      c.client_email,
      pm.project_status,
      pm.created_on,
      ft.flat_type_name
    FROM mr_project_master pm
    LEFT JOIN mr_project_details pd ON pd.project_id = pm.project_id
    LEFT JOIN mr_client c ON c.client_id = pm.client_id
    LEFT JOIN mr_tower_master t ON t.project_id = pm.project_id
    LEFT JOIN mr_floor_master f ON f.tower_id = t.tower_id
    LEFT JOIN mr_appartment_master a ON a.floor_id = f.floor_id
    LEFT JOIN mr_flat_type ft ON ft.flat_type_id = a.flat_type_id
  `;

  let params = [];
  if (user_type !== "A" && user_email) {
    query += " WHERE c.client_email = ?";
    params.push(user_email);
  }

  const [rows] = await db.query(query, params);
  return rows;
};

const getProjectById = async (projectId) => {
  const query = `
    SELECT 
      pm.project_id,
      pd.project_name,
      t.tower_name,
      f.floor_name,
      a.appartment_id AS apart_id,       -- ✅ fix here too
      a.apart_name AS apartment_name,
      a.appartment_available,
      c.client_name,
      c.client_email,
      pm.project_status,
      pm.created_on,
      ft.flat_type_name   
    FROM mr_project_master pm
    LEFT JOIN mr_project_details pd ON pd.project_id = pm.project_id
    LEFT JOIN mr_client c ON c.client_id = pm.client_id
    LEFT JOIN mr_tower_master t ON t.project_id = pm.project_id
    LEFT JOIN mr_floor_master f ON f.tower_id = t.tower_id
    LEFT JOIN mr_appartment_master a ON a.floor_id = f.floor_id
    LEFT JOIN mr_flat_type ft ON ft.flat_type_id = a.flat_type_id
    WHERE pm.project_id = ?
  `;
  const [rows] = await db.query(query, [projectId]);
  return rows;
};

const updateApartmentStatusModel = async (apartment_id, status) => {
  const query = `
    UPDATE mr_appartment_master
    SET appartment_available = ?
    WHERE appartment_id = ?
  `;
  const [result] = await db.query(query, [status, apartment_id]);
  return result;
};

module.exports = { getAllProjects, getProjectById, updateApartmentStatusModel };
