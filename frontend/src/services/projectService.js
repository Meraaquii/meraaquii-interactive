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
        user_id,
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

  updateApartmentStatus: async ({ apartment_id, status }) => {
    try {
      console.log("Incoming status to service:", status);

      const dbStatus = statusMap[status];

      console.log("Mapped DB status:", dbStatus);

      if (!dbStatus) {
        return { success: false, message: "Invalid apartment status" };
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
      return { success: false, message: error.message };
    }
  },
};

export default projectService;
