import apiClient from "../api/apiClient";

export const addTeamService = async (payload) => {
  const response = await apiClient.post("/teams/add-team", payload);

  return response.data;
};

export const getTeamsService = async () => {
  const response = await apiClient.get("/teams/get-teams");

  return response.data;
};

export const getSalespersonsByTeamService = async (team_id) => {
  const response = await apiClient.get(`/teams/team/${team_id}`);

  return response.data;
};
