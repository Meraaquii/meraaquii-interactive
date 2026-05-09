import {
  addTeamService,
  getTeamsService,
  getSalespersonsByTeamService,
} from "../services/teamService";

// Add Team
export const addTeamController = async (formData) => {
  try {
    const payload = {
      team_name: formData.teamName,
    };

    const response = await addTeamService(payload);

    return response;
  } catch (error) {
    throw error;
  }
};

// Get Teams
export const getTeamsController = async () => {
  try {
    const response = await getTeamsService();

    return response;
  } catch (error) {
    throw error;
  }
};

// Get Salespersons By Team
export const getSalespersonsByTeamController = async (team_id) => {
  try {
    const response = await getSalespersonsByTeamService(team_id);

    return response;
  } catch (error) {
    throw error;
  }
};
