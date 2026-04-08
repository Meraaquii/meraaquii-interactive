import API from "../api/apiClient.js";

export const fetchSalesman = async (paramsOrClientId = {}) => {
  try {
    let url;
    let config = {};

    if (
      typeof paramsOrClientId === "string" ||
      typeof paramsOrClientId === "number"
    ) {
      url = `/salesman/client/${paramsOrClientId}`;
    } else {
      url = "/salesman/list";
      config = { params: paramsOrClientId };
    }

    const res = await API.get(url, config);

    if (res.data.success !== undefined && !res.data.success) {
      console.error("Failed to fetch salesman:", res.data.message);
      return [];
    }

    return res.data.data ?? [];
  } catch (error) {
    console.error("Salesman API fetch error:", error);
    return [];
  }
};

// ADD salesman
export const addSalesman = async (salesmanData) => {
  try {
    const res = await API.post("/salesman/AddSalesman", salesmanData);
    return res.data;
  } catch (error) {
    console.error("Add Salesman API error:", error);
    throw error;
  }
};

// UPDATE salesman
export const updateSalesman = async (id, payload) => {
  try {
    const res = await API.put(`/salesman/UpdateSalesman/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Update Salesman API error:", error);
    throw error;
  }
};

// DELETE salesman
export const deleteSalesman = async (id) => {
  try {
    const res = await API.delete(`/salesman/DeleteSalesman/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete Salesman API error:", error);
    throw error;
  }
};
