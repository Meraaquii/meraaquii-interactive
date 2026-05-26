import projectService from "../services/projectService";

export const addProjectFilterController = async (payload) => {
  try {
    const response = await projectService.addProjectFilter(payload);
    return response;
  } catch (error) {
    console.error("CONTROLLER ERROR:", error.response?.data || error.message);
    throw error;
  }
};
