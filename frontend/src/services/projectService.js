import apiClient from "../api/apiClient";

const statusMap = {
  Available: "Y",
  Booked: "N",
  Reserve: "R",
};

const projectService = {
  getProjects: async (user_id, user_type) => {
    try {
      const response = await apiClient.get(
        `/project/getProjects?user_id=${encodeURIComponent(user_id)}&user_type=${encodeURIComponent(user_type)}`,
      );

      return response.data;
    } catch (error) {
      console.error(
        "projectService error:",
        error.response?.data || error.message,
      );

      throw error;
    }
  },

  updateApartmentStatus: async ({ apartment_id, status }) => {
    try {
      const dbStatus = statusMap[status];

      if (!dbStatus) {
        return {
          success: false,
          message: "Invalid apartment status",
        };
      }

      const { data } = await apiClient.put("/project/apartment-status", {
        apartment_id,
        status: dbStatus,
      });

      return data;
    } catch (error) {
      console.error(
        "updateApartmentStatus error:",
        error.response?.data || error.message,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  },

  addProjectFilter: async (payload) => {
    try {
      console.log("SERVICE PAYLOAD:", payload);

      // CHANGED: Pointing to the correct working endpoint URL
      const response = await apiClient.post("/project-filter/create", payload);

      console.log("SERVICE RESPONSE:", response.data);

      return response.data;
    } catch (error) {
      console.error("SERVICE ERROR:", error.response?.data || error.message);

      throw error;
    }
  },
};

export default projectService;
