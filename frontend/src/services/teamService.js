import apiClient from "../api/apiClient";

// Add Team
export const addTeamService = async (payload) => {
  const response = await apiClient.post("/teams/add-team", payload);

  return response.data;
};

// Update Team
export const updateTeamService = async (team_id, payload) => {
  const response = await apiClient.put(
    `/teams/update-team/${team_id}`,
    payload,
  );

  return response.data;
};

// Get Teams
export const getTeamsService = async () => {
  const response = await apiClient.get("/teams/get-teams");

  return response.data;
};

// Get Salespersons By Team
export const getSalespersonsByTeamService = async (team_id) => {
  const response = await apiClient.get(`/teams/team/${team_id}`);

  return response.data;
};

// Delete Team
export const deleteTeamService = async (team_id) => {
  const response = await apiClient.delete(`/teams/delete-team/${team_id}`);
  return response.data;
};
