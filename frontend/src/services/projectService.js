import apiClient from "../api/apiClient";

const projectService = {
  getProjects: async (user_email, user_type) => {
    try {
      const response = await apiClient.get(
        `/project/getProjects?user_email=${encodeURIComponent(user_email)}&user_type=${encodeURIComponent(user_type)}`,
      );
      console.log("projectService raw response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "projectService error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};

export default projectService;
