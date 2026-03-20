import apiClient from "../api/apiClient";

const authService = {
  /**
   * Login user
   * @param {string} user_email
   * @param {string} user_password
   * @returns {Promise<{status, message, user}>}
   */
  login: async (user_email, user_password) => {
    const response = await apiClient.post("/auth/login", {
      user_email,
      user_password,
    });
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} userData
   * @returns {Promise<{status, message, userId}>}
   */
  signUp: async (userData) => {
    const response = await apiClient.post("/auth/signup", userData);
    return response.data;
  },

  /**
   * Activate user (admin only)
   * @param {string} user_email
   * @returns {Promise<{status, message}>}
   */
  activateUser: async (user_email) => {
    const response = await apiClient.post("/auth/activate", { user_email });
    return response.data;
  },
};

export default authService;
