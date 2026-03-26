import API from "../api/apiClient.js";

// GET salesman list
export const fetchSalesman = async (clientId) => {
  const res = await API.get(`/clients/salesman/${clientId}`);
  return res.data.data;
};

// ADD salesman
export const addSalesman = async (salesmanData) => {
  const res = await API.post("/salesman/addSalesman", salesmanData);
  return res.data;
};

// UPDATE salesman
export const updateSalesman = async (payload) => {
  console.log("Payload in service:", payload);
  const res = await API.put(`/salesman/updateSalesman/${payload.id}`, payload);
  return res.data;
};

// DELETE salesman
export const deleteSalesman = async (id) => {
  const res = await API.delete(`/salesman/deleteSalesman/${id}`);
  return res.data;
};
