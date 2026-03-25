const db = require("../config/database.js");

const getAllProjects = async (user_email, user_type) => {
  let query = `
    SELECT 
      pm.project_id,
      pd.project_name,
      t.tower_name,
      f.floor_name,
      a.apart_name AS apartment_name,
      a.aprtment_status AS apartment_status,
      c.client_name,
      c.client_email,
      pm.project_status,
      pm.created_on
    FROM mr_project_master pm
    LEFT JOIN mr_project_details pd ON pd.project_id = pm.project_id
    LEFT JOIN mr_client c ON c.client_id = pm.client_id
    LEFT JOIN mr_tower_master t ON t.project_id = pm.project_id
    LEFT JOIN mr_floor_master f ON f.tower_id = t.tower_id
    LEFT JOIN mr_appartment_master a ON a.floor_id = f.floor_id
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
      p.project_id,
      p.project_name,
      t.tower_name,
      f.floor_name,
      a.apart_name AS apartment_name,
      a.aprtment_status AS apartment_status
    FROM mr_project_master p
    LEFT JOIN mr_tower_master t ON t.project_id = p.project_id
    LEFT JOIN mr_floor_master f ON f.tower_id = t.tower_id
    LEFT JOIN mr_appartment_master a ON a.floor_id = f.floor_id
    WHERE p.project_id = ?
  `;
  const [rows] = await db.query(query, [projectId]);
  return rows;
};

module.exports = { getAllProjects, getProjectById };
