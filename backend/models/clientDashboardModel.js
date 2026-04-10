const db = require("../config/database");

const getDashboardData = async (clientId) => {
  const [rows] = await db.query(
    `SELECT
      -- Projects
      (SELECT COUNT(*) 
       FROM mr_project_master 
       WHERE client_id = ?) AS total_projects,

      -- Devices
      (SELECT COUNT(*) 
       FROM mr_device 
       WHERE client_id = ?) AS total_devices,

      -- Salesman
      (SELECT COUNT(*) 
       FROM mr_salesman 
       WHERE client_id = ?) AS total_salesman,

      -- Customers
      (SELECT COUNT(*) 
       FROM mr_customer 
       WHERE client_id = ?) AS total_customers,

      -- Total Apartments
      (SELECT COUNT(*) 
       FROM mr_appartment_master am
       JOIN mr_floor_master f ON am.floor_id = f.floor_id
       JOIN mr_tower_master t ON f.tower_id = t.tower_id
       JOIN mr_project_master pm ON t.project_id = pm.project_id
       WHERE pm.client_id = ?
      ) AS total_apartments,

      -- Available Apartments
      (SELECT COUNT(*) 
       FROM mr_appartment_master am
       JOIN mr_floor_master f ON am.floor_id = f.floor_id
       JOIN mr_tower_master t ON f.tower_id = t.tower_id
       JOIN mr_project_master pm ON t.project_id = pm.project_id
       WHERE pm.client_id = ?
       AND am.appartment_available = 'Y'
      ) AS total_apartments_available,

      -- Booked Apartments
      (SELECT COUNT(*) 
       FROM mr_appartment_master am
       JOIN mr_floor_master f ON am.floor_id = f.floor_id
       JOIN mr_tower_master t ON f.tower_id = t.tower_id
       JOIN mr_project_master pm ON t.project_id = pm.project_id
       WHERE pm.client_id = ?
       AND am.appartment_available = 'N'
      ) AS total_apartments_booked,

      -- Reserved Apartments
      (SELECT COUNT(*) 
       FROM mr_appartment_master am
       JOIN mr_floor_master f ON am.floor_id = f.floor_id
       JOIN mr_tower_master t ON f.tower_id = t.tower_id
       JOIN mr_project_master pm ON t.project_id = pm.project_id
       WHERE pm.client_id = ?
       AND am.appartment_available = 'Reserve'
      ) AS total_apartments_reserved
    `,
    [
      clientId,
      clientId,
      clientId,
      clientId,
      clientId,
      clientId,
      clientId,
      clientId,
    ],
  );

  return rows[0];
};

const getProjectDetails = async (clientId) => {
  const [rows] = await db.query(
    `SELECT
      pd.project_name,
      COUNT(DISTINCT t.tower_id) AS tower_count,
      COUNT(am.appartment_id) AS apartment_count,
      SUM(CASE WHEN am.appartment_available = 'Y' THEN 1 ELSE 0 END) AS available,
      SUM(CASE WHEN am.appartment_available = 'N' THEN 1 ELSE 0 END) AS booked
    FROM mr_project_master pm
    LEFT JOIN mr_project_details pd ON pm.project_id = pd.project_id
    LEFT JOIN mr_tower_master t ON pm.project_id = t.project_id
    LEFT JOIN mr_floor_master f ON t.tower_id = f.tower_id
    LEFT JOIN mr_appartment_master am ON f.floor_id = am.floor_id
    WHERE pm.client_id = ?
    GROUP BY pm.project_id, pd.project_name`,
    [clientId],
  );
  return rows;
};

module.exports = { getDashboardData, getProjectDetails };
