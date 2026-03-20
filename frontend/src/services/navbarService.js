const navbarService = {
  /**
   * Get the logged-in user from localStorage
   * @returns {Object|null}
   */
  getUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear all auth data from localStorage
   */
  clearSession: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
  },

  /**
   * Call backend logout endpoint
   * @returns {Promise}
   */
  logoutApi: async () => {
    const { default: apiClient } = await import("../api/apiClient");
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};

export default navbarService;
