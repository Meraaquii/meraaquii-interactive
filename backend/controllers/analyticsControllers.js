const {
  getSalesmanOverview,
  getSalesmanPerformance,
  getSalesmanDetail,
  getRegionalBreakdown,
  getSalesmanTrends,
  getRecentActivities,
  getSalesmanDetailById,
} = require("../models/analyticsModel.js");

/**
 * All routes expect ?user_id=18 (the logged-in user's ID from login response)
 * The model resolves user_id -> salesman_id internally via mr_salesman.user_id
 */
const getUserId = (req) => {
  const userId = req.query.user_id || req.params.userId;
  return userId ? parseInt(userId) : null;
};

/**
 * GET /analytics/salesman/overview?user_id=18
 */
const salesmanOverview = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "user_id is required" });

    const data = await getSalesmanOverview(userId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Salesman Overview Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch overview",
      error: error.message,
    });
  }
};

/**
 * GET /analytics/salesman/performance?user_id=18
 */
const salesmanPerformance = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "user_id is required" });

    const data = await getSalesmanPerformance(userId);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Salesman not found" });

    res.json({ success: true, data });
  } catch (error) {
    console.error("Salesman Performance Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch performance",
      error: error.message,
    });
  }
};

/**
 * GET /analytics/salesman/detail?user_id=18
 */
const salesmanDetail = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "user_id is required" });

    const data = await getSalesmanDetail(userId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Salesman Detail Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch detail",
      error: error.message,
    });
  }
};

/**
 * GET /analytics/salesman/regions?user_id=18
 */
const regionalBreakdown = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "user_id is required" });

    const data = await getRegionalBreakdown(userId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Regional Breakdown Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch breakdown",
      error: error.message,
    });
  }
};

/**
 * GET /analytics/salesman/trends?user_id=18
 */
const salesmanTrends = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "user_id is required" });

    const data = await getSalesmanTrends(userId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Salesman Trends Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trends",
      error: error.message,
    });
  }
};

/**
 * GET /analytics/salesman/activities?user_id=18&limit=5
 */
const recentActivities = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "user_id is required" });

    const limit = parseInt(req.query.limit) || 5;
    const data = await getRecentActivities(userId, limit);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Recent Activities Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
      error: error.message,
    });
  }
};

/**
 * GET /analytics/salesman/detail-by-id?salesman_id=1
 * For client view - fetch any salesman's data by salesman_id
 */
const salesmanDetailById = async (req, res) => {
  try {
    const salesmanId = req.query.salesman_id || req.params.salesmanId;
    if (!salesmanId)
      return res
        .status(400)
        .json({ success: false, message: "salesman_id is required" });

    const data = await getSalesmanDetailById(parseInt(salesmanId));
    if (!data || !data.salesman_id) {
      return res
        .status(404)
        .json({ success: false, message: "Salesman not found" });
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Salesman Detail By Id Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch salesman detail",
      error: error.message,
    });
  }
};

module.exports = {
  salesmanOverview,
  salesmanPerformance,
  salesmanDetail,
  regionalBreakdown,
  salesmanTrends,
  recentActivities,
  salesmanDetailById,
};
