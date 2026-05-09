import {
  fetchSalesPersons,
  addSalesPerson,
  updateSalesPerson,
  deleteSalesPerson,
} from "../services/salespersonService.js";

export const getSalespersonData = async (setRows, clientId) => {
  try {
    const data = await fetchSalesPersons(clientId);

    if (!Array.isArray(data)) {
      console.error("Salesperson API returned invalid data:", data);
      return;
    }

    const formatted = data.map((item) => ({
      id: item.salesperson_id,
      name: item.salesperson_name,
      phone: item.salesperson_phone,
      email: item.salesperson_email,

      // FIXED
      team_name: item.team_name,

      created_at: item.created_at,
    }));

    console.log("Formatted Salesperson Data:", formatted);

    setRows(formatted);
  } catch (error) {
    console.error("Error fetching salesperson data:", error);
  }
};

export const addSalesPersonData = async (salespersonData) => {
  try {
    return await addSalesPerson(salespersonData);
  } catch (error) {
    throw new Error(error.message || "Failed to add salesperson");
  }
};

export const updateSalesPersonData = async (id, payload) => {
  try {
    const formattedPayload = {
      salesperson_name: payload.name,
      salesperson_phone: payload.phone,
      salesperson_email: payload.email,
      team_name: payload.team_name, // was "team", now "team_name"
      client_id: payload.client_id || null, // add this
      user_id: payload.user_id || null, // add this
    };

    return await updateSalesPerson(id, formattedPayload);
  } catch (error) {
    throw new Error(error.message || "Failed to update salesperson");
  }
};

export const deleteSalesmanData = async (id) => {
  try {
    return await deleteSalesPerson(id);
  } catch (error) {
    throw new Error(error.message || "Failed to delete salesperson");
  }
};
