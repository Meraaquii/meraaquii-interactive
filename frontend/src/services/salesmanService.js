import API from "../api/apiClient.js";

export const fetchSalesman = async (clientId) => {
  const res = await API.get(`/clients/salesman/${clientId}`);
  return res.data.data; // ✅ fixed
};
