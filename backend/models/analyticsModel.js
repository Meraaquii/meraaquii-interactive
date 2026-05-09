const db = require("../config/database.js");

// ==================== HELPERS ====================

/**
 * Resolve salesman_id from user_id (login token contains user_id)
 * mr_salesman.user_id = logged-in user's user_id
 */
const resolveSalesmanId = async (userId) => {
  const [rows] = await db.query(
    `SELECT salesman_id FROM mr_salesman WHERE user_id = ? LIMIT 1`,
    [userId],
  );
  if (!rows || rows.length === 0)
    throw new Error(`No salesman found for user_id=${userId}`);
  return rows[0].salesman_id;
};

function getRandomColor(id) {
  const colors = [
    "#6366f1",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#f43f5e",
    "#8b5cf6",
  ];
  return colors[(id || 0) % colors.length];
}

function formatTimeAgo(date) {
  if (!date) return "Recently";
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hrs ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

// ==================== SALESMAN DASHBOARD ANALYTICS ====================

/**
 * Get overall KPI metrics for a specific salesman (by user_id)
 */
const getSalesmanOverview = async (userId) => {
  try {
    const salesmanId = await resolveSalesmanId(userId);

    const [rows] = await db.query(
      `
      SELECT
        COUNT(DISTINCT c.cus_id)       AS total_customers,
        COUNT(DISTINCT c.client_id)    AS total_clients,
        COUNT(DISTINCT pm.project_id)  AS total_projects
      FROM mr_salesman s
      LEFT JOIN mr_customer c
        ON c.salesman_id = s.salesman_id
      LEFT JOIN mr_project_master pm
        ON pm.client_id = c.client_id
      WHERE s.salesman_id = ?
    `,
      [salesmanId],
    );

    const totalProjects = rows[0]?.total_projects || 0;
    const completionRate = Math.min(
      100,
      Math.round((totalProjects / 15) * 100),
    );

    return {
      salesman_id: salesmanId,
      total_projects: totalProjects,
      total_customers: rows[0]?.total_customers || 0,
      total_clients: rows[0]?.total_clients || 0,
      active_salesmen: 1,
      total_salesmen: 1,
      completion_rate: completionRate,
      avg_growth: 0,
      target: 15,
    };
  } catch (error) {
    console.error("Error in getSalesmanOverview:", error.message);
    return {
      salesman_id: null,
      total_projects: 0,
      total_customers: 0,
      total_clients: 0,
      active_salesmen: 0,
      total_salesmen: 0,
      completion_rate: 0,
      avg_growth: 0,
      target: 15,
    };
  }
};

/**
 * Get performance data for a specific salesman (by user_id)
 */
const getSalesmanPerformance = async (userId) => {
  try {
    const salesmanId = await resolveSalesmanId(userId);

    const [rows] = await db.query(
      `
      SELECT
        s.salesman_id,
        s.salesman_name,
        s.salesman_email,
        s.salesman_phone_no,
        COUNT(DISTINCT c.cus_id)      AS deals,
        COUNT(DISTINCT c.client_id)   AS clients,
        COUNT(DISTINCT pm.project_id) AS projects
      FROM mr_salesman s
      LEFT JOIN mr_customer c
        ON c.salesman_id = s.salesman_id
      LEFT JOIN mr_project_master pm
        ON pm.client_id = c.client_id
      WHERE s.salesman_id = ?
      GROUP BY s.salesman_id, s.salesman_name, s.salesman_email, s.salesman_phone_no
    `,
      [salesmanId],
    );

    if (!rows || rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.salesman_id,
      name: row.salesman_name,
      email: row.salesman_email,
      phone: row.salesman_phone_no,
      projects: row.projects || 0,
      clients: row.clients || 0,
      target: 15,
      deals: row.deals || 0,
      status: "Active",
      avatar: row.salesman_name?.substring(0, 2).toUpperCase() || "SM",
      color: getRandomColor(row.salesman_id),
    };
  } catch (error) {
    console.error("Error in getSalesmanPerformance:", error.message);
    return null;
  }
};

/**
 * Get customers + projects for a specific salesman (by user_id)
 */
const getSalesmanDetail = async (userId) => {
  try {
    const salesmanId = await resolveSalesmanId(userId);

    // Get salesman basic info
    const [salesmanRows] = await db.query(
      `SELECT salesman_id, salesman_name, salesman_email, salesman_phone_no
       FROM mr_salesman WHERE salesman_id = ?`,
      [salesmanId],
    );
    const salesmanInfo = salesmanRows?.[0] || {};

    const [customers, projects] = await Promise.all([
      db.query(
        `
        SELECT
          c.cus_id AS id,
          c.cus_name AS name,
          c.cus_email AS email,
          c.cus_phone AS phone,
          c.cus_address AS address,
          c.cus_status AS status,
          c.created_on AS created_date
        FROM mr_customer c
        WHERE c.salesman_id = ?
        ORDER BY c.created_on DESC
      `,
        [salesmanId],
      ),

      db.query(
        `
        SELECT
          pm.project_id AS id,
          pd.project_name AS title,
          pm.project_status AS status,
          pm.proj_check AS progress,
          pm.created_on AS due_date
        FROM mr_project_master pm
        LEFT JOIN mr_project_details pd ON pd.project_id = pm.project_id
        WHERE pm.client_id IN (
          SELECT DISTINCT client_id FROM mr_customer WHERE salesman_id = ?
        )
        ORDER BY pm.created_on DESC
      `,
        [salesmanId],
      ),
    ]);

    return {
      salesman_id: salesmanId,
      name: salesmanInfo.salesman_name,
      email: salesmanInfo.salesman_email,
      phone: salesmanInfo.salesman_phone_no,
      customers: customers || [],
      projects: projects || [],
      summary: {
        total_customers: customers.length,
        total_projects: projects.length,
        active_projects: projects.filter(
          (p) => p.status === "A" || p.status === "Active",
        ).length,
      },
    };
  } catch (error) {
    console.error("Error in getSalesmanDetail:", error.message);
    return {
      salesman_id: null,
      name: "",
      email: "",
      phone: "",
      customers: [],
      projects: [],
      summary: { total_customers: 0, total_projects: 0, active_projects: 0 },
    };
  }
};

/**
 * Get project breakdown by client for a specific salesman (by user_id)
 */
const getRegionalBreakdown = async (userId) => {
  try {
    const salesmanId = await resolveSalesmanId(userId);

    const [rows] = await db.query(
      `
      SELECT
        pm.client_id,
        COUNT(DISTINCT pm.project_id) AS projects
      FROM mr_project_master pm
      WHERE pm.client_id IN (
        SELECT DISTINCT client_id FROM mr_customer WHERE salesman_id = ?
      )
      GROUP BY pm.client_id
      ORDER BY projects DESC
    `,
      [salesmanId],
    );

    if (!rows || rows.length === 0) return [];

    const colors = [
      "#6366f1",
      "#ec4899",
      "#f59e0b",
      "#10b981",
      "#f43f5e",
      "#8b5cf6",
    ];
    const total = rows.reduce((sum, r) => sum + (r.projects || 0), 0) || 1;

    return rows.map((row, index) => ({
      name: `Client ${row.client_id}`,
      projects: row.projects || 0,
      pct: Math.round(((row.projects || 0) / total) * 100),
      color: colors[index % colors.length],
    }));
  } catch (error) {
    console.error("Error in getRegionalBreakdown:", error.message);
    return [];
  }
};

/**
 * Get monthly project trends for a specific salesman (by user_id)
 */
const getSalesmanTrends = async (userId) => {
  try {
    const salesmanId = await resolveSalesmanId(userId);

    const [rows] = await db.query(
      `
      SELECT
        DATE_FORMAT(pm.created_on, '%b %Y') AS month_label,
        DATE_FORMAT(pm.created_on, '%Y-%m') AS month_sort,
        COUNT(*)                            AS count
      FROM mr_project_master pm
      WHERE pm.created_on >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        AND pm.client_id IN (
          SELECT DISTINCT client_id FROM mr_customer WHERE salesman_id = ?
        )
      GROUP BY DATE_FORMAT(pm.created_on, '%Y-%m'), DATE_FORMAT(pm.created_on, '%b %Y')
      ORDER BY month_sort ASC
      LIMIT 6
    `,
      [salesmanId],
    );

    if (!rows || rows.length === 0) return [];

    return rows.map((row) => ({ month: row.month_label, count: row.count }));
  } catch (error) {
    console.error("Error in getSalesmanTrends:", error.message);
    return [];
  }
};

/**
 * Get recent activities for a specific salesman (by user_id)
 */
const getRecentActivities = async (userId, limit = 5) => {
  try {
    const salesmanId = await resolveSalesmanId(userId);

    // Try activity logs table first
    try {
      const [rows] = await db.query(
        `
        SELECT
          a.activity_id          AS id,
          s.salesman_name        AS name,
          a.activity_description AS action,
          a.created_on           AS time,
          a.activity_type        AS type,
          '#6366f1'              AS color
        FROM mr_activity_logs a
        JOIN mr_salesman s ON s.salesman_id = a.user_id
        WHERE a.user_type = 'salesman' AND a.user_id = ?
        ORDER BY a.created_on DESC
        LIMIT ?
      `,
        [salesmanId, limit],
      );

      if (rows.length > 0) {
        return rows.map((row) => ({
          id: row.id,
          name: row.name,
          action: row.action,
          time: formatTimeAgo(row.time),
          type: row.type,
          color: row.color,
        }));
      }
    } catch (_) {
      /* table doesn't exist */
    }

    // Fallback: derive from mr_customer + mr_project_master
    const [rows] = await db.query(
      `
      (
        SELECT
          'deal'          AS type,
          s.salesman_name AS name,
          CONCAT('Closed deal with ', c.cus_name) AS action,
          c.created_on    AS time
        FROM mr_customer c
        JOIN mr_salesman s ON s.salesman_id = c.salesman_id
        WHERE c.salesman_id = ?
        ORDER BY c.created_on DESC
        LIMIT 3
      )
      UNION ALL
      (
        SELECT
          'project'       AS type,
          s.salesman_name AS name,
          CONCAT('Project: ', COALESCE(pd.project_name, CONCAT('#', pm.project_id)),
                 ' [', pm.project_status, ']') AS action,
          pm.created_on   AS time
        FROM mr_project_master pm
        LEFT JOIN mr_project_details pd ON pd.project_id = pm.project_id
        JOIN mr_customer c              ON c.client_id   = pm.client_id
        JOIN mr_salesman s              ON s.salesman_id = c.salesman_id
        WHERE c.salesman_id = ?
        ORDER BY pm.created_on DESC
        LIMIT 2
      )
      ORDER BY time DESC
      LIMIT ?
    `,
      [salesmanId, salesmanId, limit],
    );

    if (!rows || rows.length === 0) return [];

    return rows.map((row, index) => ({
      id: index + 1,
      name: row.name,
      action: row.action,
      time: formatTimeAgo(row.time),
      type: row.type,
      color: getRandomColor(index),
    }));
  } catch (error) {
    console.error("Error in getRecentActivities:", error.message);
    return [];
  }
};

const getSalesmanDetailById = async (salesmanId) => {
  try {
    // Get salesman basic info
    const [salesmanRows] = await db.query(
      `SELECT salesman_id, salesman_name, salesman_email, salesman_phone_no, created_on
       FROM mr_salesman WHERE salesman_id = ?`,
      [salesmanId],
    );

    if (!salesmanRows || salesmanRows.length === 0) {
      throw new Error(`No salesman found with salesman_id=${salesmanId}`);
    }

    const salesmanInfo = salesmanRows[0];

    // Get projects count
    const [projectRows] = await db.query(
      `
      SELECT COUNT(DISTINCT pm.project_id) AS total_projects
      FROM mr_project_master pm
      WHERE pm.client_id IN (
        SELECT DISTINCT client_id FROM mr_customer WHERE salesman_id = ?
      )
    `,
      [salesmanId],
    );

    // Get deals count (customers) and clients count (distinct client_id)
    const [dealRows] = await db.query(
      `SELECT
        COUNT(*) AS total_customers,
        COUNT(DISTINCT client_id) AS total_clients
      FROM mr_customer WHERE salesman_id = ?`,
      [salesmanId],
    );

    // Get recent projects
    const [projects] = await db.query(
      `
      SELECT
        pm.project_id AS id,
        pd.project_name AS title,
        pm.project_status AS status,
        pm.proj_check AS progress,
        pm.created_on AS due_date
      FROM mr_project_master pm
      LEFT JOIN mr_project_details pd ON pd.project_id = pm.project_id
      WHERE pm.client_id IN (
        SELECT DISTINCT client_id FROM mr_customer WHERE salesman_id = ?
      )
      ORDER BY pm.created_on DESC
      LIMIT 10
    `,
      [salesmanId],
    );

    // Get monthly trends
    const [trends] = await db.query(
      `
      SELECT
        DATE_FORMAT(pm.created_on, '%b %Y') AS month,
        DATE_FORMAT(pm.created_on, '%Y-%m') AS month_sort,
        COUNT(*) AS count
      FROM mr_project_master pm
      WHERE pm.created_on >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        AND pm.client_id IN (
          SELECT DISTINCT client_id FROM mr_customer WHERE salesman_id = ?
        )
      GROUP BY DATE_FORMAT(pm.created_on, '%Y-%m'), DATE_FORMAT(pm.created_on, '%b %Y')
      ORDER BY month_sort ASC
      LIMIT 6
    `,
      [salesmanId],
    );

    // Get customers list
    const [customers] = await db.query(
      `
      SELECT
        c.cus_id AS id,
        c.cus_name AS name,
        c.cus_email AS email,
        c.cus_phone AS phone,
        c.cus_address AS address,
        c.cus_status AS status,
        c.created_on AS created_date
      FROM mr_customer c
      WHERE c.salesman_id = ?
      ORDER BY c.created_on DESC
    `,
      [salesmanId],
    );

    // Get recent deals/activities
    const [activities] = await db.query(
      `
      SELECT
        c.cus_id AS id,
        c.cus_name AS name,
        CONCAT('Added customer ', c.cus_name) AS action,
        c.created_on AS time
      FROM mr_customer c
      WHERE c.salesman_id = ?
      ORDER BY c.created_on DESC
      LIMIT 5
    `,
      [salesmanId],
    );

    const totalProjects = projectRows?.[0]?.total_projects || 0;
    const totalCustomers = dealRows?.[0]?.total_customers || 0;
    const totalClients = dealRows?.[0]?.total_clients || 0;
    const completionRate = Math.min(
      100,
      Math.round((totalProjects / 15) * 100),
    );

    return {
      salesman_id: salesmanId,
      name: salesmanInfo.salesman_name,
      email: salesmanInfo.salesman_email,
      phone: salesmanInfo.salesman_phone_no,
      total_projects: totalProjects,
      total_customers: totalCustomers,
      total_clients: totalClients,
      target: 15,
      completion_rate: completionRate,
      growth: 12, // Placeholder - calculate from trends
      customers: customers || [],
      projects: projects || [],
      trends: trends || [],
      activities: (activities || []).map((a) => ({
        ...a,
        time: formatTimeAgo(a.time),
      })),
      recent_deals: (activities || []).map((a) => ({
        id: a.id,
        title: a.name,
        status: "Closed",
        value: "",
        date: formatTimeAgo(a.time),
      })),
    };
  } catch (error) {
    console.error("Error in getSalesmanDetailById:", error.message);
    return {
      salesman_id: salesmanId,
      total_projects: 0,
      total_customers: 0,
      total_clients: 0,
      target: 15,
      completion_rate: 0,
      growth: 0,
      projects: [],
      trends: [],
      activities: [],
      recent_deals: [],
    };
  }
};

module.exports = {
  getSalesmanOverview,
  getSalesmanPerformance,
  getSalesmanDetail,
  getRegionalBreakdown,
  getSalesmanTrends,
  getRecentActivities,
  getSalesmanDetailById,
};
