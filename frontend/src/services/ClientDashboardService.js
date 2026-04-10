import apiClient from "../api/apiClient";

export const fetchDashboardData = async (clientId) => {
  const response = await apiClient.get(`/dashboard/${clientId}`);
  return response.data.data;
};

export const fetchProjectDetails = async (clientId) => {
  const response = await apiClient.get(
    `/dashboard/${clientId}/project-details`,
  );
  return response.data.data;
};
