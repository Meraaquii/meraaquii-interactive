import apiClient from "../api/apiClient";

const authService = {
  login: async (user_email, user_password) => {
    const response = await apiClient.post("/auth/login", {
      user_email,
      user_password,
    });
    return response.data;
  },

  signUp: async (userData) => {
    const response = await apiClient.post("/auth/signup", userData);
    return response.data;
  },

  activateUser: async (user_email) => {
    const response = await apiClient.post("/auth/activate", { user_email });
    return response.data;
  },
};

export default authService;
