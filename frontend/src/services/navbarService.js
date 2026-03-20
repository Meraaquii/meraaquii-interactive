const navbarService = {
  getUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
  },

  logoutApi: async () => {
    const { default: apiClient } = await import("../api/apiClient");
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};

export default navbarService;
