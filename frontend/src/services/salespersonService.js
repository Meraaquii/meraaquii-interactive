import API from "../api/apiClient.js";

// FETCH
export const fetchSalesPersons = async () => {
  try {
    const res = await API.get("/salesperson/all");

    console.log("Salesperson API Response:", res.data);

    return res.data.data || [];
  } catch (error) {
    console.error("Salesperson API fetch error:", error);
    return [];
  }
};

// ADD
export const addSalesPerson = async (salespersonData) => {
  try {
    const res = await API.post("/salesperson/add", salespersonData);

    return res.data;
  } catch (error) {
    console.error("Salesperson API add error:", error);
    throw error;
  }
};

// UPDATE
export const updateSalesPerson = async (id, payload) => {
  try {
    const res = await API.put(`/salesperson/update/${id}`, payload);

    return res.data;
  } catch (error) {
    console.error("Salesperson API update error:", error);
    throw error;
  }
};

// DELETE
export const deleteSalesPerson = async (id) => {
  try {
    const res = await API.delete(`/salesperson/delete/${id}`);

    return res.data;
  } catch (error) {
    console.error("Salesperson API delete error:", error);
    throw error;
  }
};
