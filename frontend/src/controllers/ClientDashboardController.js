import { fetchDashboardData } from "../services/ClientDashboardService";

export const getDashboardData = async (setRows, clientId) => {
  try {
    const data = await fetchDashboardData(clientId);
    setRows(data);
  } catch (error) {
    console.error(error);
  }
};
