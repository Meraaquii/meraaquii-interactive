import API from "../api/apiClient.js";

/**
 * Reads the logged-in user's ID from localStorage (set at login)
 * Login response stores user_id from: { user_id, user_type: "S", ... }
 */
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.user_id || null;
};

/**
 * GET /analytics/salesman/overview?user_id=18
 */
export const fetchSalesmanOverview = async () => {
  try {
    const user_id = getUserId();
    if (!user_id) {
      console.error("No user_id in localStorage");
      return null;
    }

    const res = await API.get("/analytics/salesman/overview", {
      params: { user_id },
    });
    if (!res.data.success) {
      console.error("Failed to fetch overview:", res.data.message);
      return null;
    }
    return res.data.data;
  } catch (error) {
    console.error("Analytics Overview API error:", error);
    return null;
  }
};

/**
 * GET /analytics/salesman/performance?user_id=18
 */
export const fetchSalesmanPerformance = async () => {
  try {
    const user_id = getUserId();
    if (!user_id) {
      console.error("No user_id in localStorage");
      return [];
    }

    const res = await API.get("/analytics/salesman/performance", {
      params: { user_id },
    });
    if (!res.data.success) {
      console.error("Failed to fetch performance:", res.data.message);
      return [];
    }
    return res.data.data ?? [];
  } catch (error) {
    console.error("Analytics Performance API error:", error);
    return [];
  }
};

/**
 * GET /analytics/salesman/detail?user_id=18
 */
export const fetchSalesmanDetail = async () => {
  try {
    const user_id = getUserId();
    if (!user_id) {
      console.error("No user_id in localStorage");
      return null;
    }

    const res = await API.get("/analytics/salesman/detail", {
      params: { user_id },
    });
    if (!res.data.success) {
      console.error("Failed to fetch detail:", res.data.message);
      return null;
    }
    return res.data.data;
  } catch (error) {
    console.error("Analytics Detail API error:", error);
    return null;
  }
};

/**
 * GET /analytics/salesman/regions?user_id=18
 */
export const fetchRegionalBreakdown = async () => {
  try {
    const user_id = getUserId();
    if (!user_id) {
      console.error("No user_id in localStorage");
      return [];
    }

    const res = await API.get("/analytics/salesman/regions", {
      params: { user_id },
    });
    if (!res.data.success) {
      console.error("Failed to fetch regions:", res.data.message);
      return [];
    }
    return res.data.data ?? [];
  } catch (error) {
    console.error("Analytics Regions API error:", error);
    return [];
  }
};

/**
 * GET /analytics/salesman/trends?user_id=18
 */
export const fetchSalesmanTrends = async () => {
  try {
    const user_id = getUserId();
    if (!user_id) {
      console.error("No user_id in localStorage");
      return [];
    }

    const res = await API.get("/analytics/salesman/trends", {
      params: { user_id },
    });
    if (!res.data.success) {
      console.error("Failed to fetch trends:", res.data.message);
      return [];
    }
    return res.data.data ?? [];
  } catch (error) {
    console.error("Analytics Trends API error:", error);
    return [];
  }
};

/**
 * GET /analytics/salesman/activities?user_id=18&limit=5
 */
export const fetchRecentActivities = async (limit = 5) => {
  try {
    const user_id = getUserId();
    if (!user_id) {
      console.error("No user_id in localStorage");
      return [];
    }

    const res = await API.get("/analytics/salesman/activities", {
      params: { user_id, limit },
    });
    if (!res.data.success) {
      console.error("Failed to fetch activities:", res.data.message);
      return [];
    }
    return res.data.data ?? [];
  } catch (error) {
    console.error("Analytics Activities API error:", error);
    return [];
  }
};

/**
 * GET /analytics/salesman/detail-by-id?salesman_id=1
 * For client view - fetch any salesman's data by salesman_id
 */
export const fetchSalesmanDetailById = async (salesmanId) => {
  try {
    if (!salesmanId) {
      console.error("No salesman_id provided");
      return null;
    }

    const res = await API.get("/analytics/salesman/detail-by-id", {
      params: { salesman_id: salesmanId },
    });
    if (!res.data.success) {
      console.error("Failed to fetch salesman detail:", res.data.message);
      return null;
    }
    return res.data.data;
  } catch (error) {
    console.error("Analytics Detail By Id API error:", error);
    return null;
  }
};
