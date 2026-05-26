import {
  addTeamService,
  getTeamsService,
  getSalespersonsByTeamService,
  updateTeamService,
  deleteTeamService,
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

// Update Team
export const updateTeamController = async (formData) => {
  try {
    const payload = {
      team_name: formData.team_name,
    };

    const response = await updateTeamService(formData.team_id, payload);

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

// Delete Team
export const deleteTeamController = async (team_id) => {
  try {
    const response = await deleteTeamService(team_id);
    return response;
  } catch (error) {
    throw error;
  }
};
