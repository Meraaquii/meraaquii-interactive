import API from "../api/apiClient.js";

export const fetchSalesman = async () => {
  const res = await API.get("/clients/salesman");
  return res.data.data;
};
