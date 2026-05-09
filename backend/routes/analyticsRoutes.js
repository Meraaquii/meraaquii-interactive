const express = require("express");
const router = express.Router();
const {
  salesmanOverview,
  salesmanPerformance,
  salesmanDetail,
  regionalBreakdown,
  salesmanTrends,
  recentActivities,
  salesmanDetailById,
} = require("../controllers/analyticsControllers.js");

// ==================== SALESMAN ANALYTICS ROUTES ====================
// Base: /v1/api/analytics
// All routes require ?user_id=<logged_in_user_id>
//
// GET /v1/api/analytics/salesman/overview?user_id=18
// GET /v1/api/analytics/salesman/performance?user_id=18
// GET /v1/api/analytics/salesman/detail?user_id=18
// GET /v1/api/analytics/salesman/regions?user_id=18
// GET /v1/api/analytics/salesman/trends?user_id=18
// GET /v1/api/analytics/salesman/activities?user_id=18&limit=5

router.get("/salesman/overview", salesmanOverview);
router.get("/salesman/performance", salesmanPerformance);
router.get("/salesman/detail", salesmanDetail);
router.get("/salesman/detail-by-id", salesmanDetailById);
router.get("/salesman/regions", regionalBreakdown);
router.get("/salesman/trends", salesmanTrends);
router.get("/salesman/activities", recentActivities);

module.exports = router;
