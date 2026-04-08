import { fetchSalesman, deleteSalesman } from "../services/salesmanService";

export const getSalesmanData = async (setRows, userOrClientId) => {
  try {
    let fetchArg;

    if (
      typeof userOrClientId === "string" ||
      typeof userOrClientId === "number"
    ) {
      // ✅ Client mode — pass clientId directly
      fetchArg = userOrClientId;
    } else {
      // ✅ Salesman mode — build params from user object
      const { user_type, user_id, user_email } = userOrClientId;

      if (user_type === "A") {
        fetchArg = { user_type: "A" };
      } else if (user_type === "S") {
        fetchArg = { user_type: "S", user_id };
      } else if (user_type === "C") {
        fetchArg = { user_type: "C", user_email };
      } else {
        fetchArg = {};
      }
    }

    const data = await fetchSalesman(fetchArg);

    if (!Array.isArray(data)) {
      console.error("Salesman API returned invalid data:", data);
      return;
    }

    const formatted = data.map((item) => ({
      id: item.salesman_id,
      name: item.salesman_name,
      phone: item.salesman_phone_no,
      email: item.salesman_email,
      createdAt: item.created_on,
    }));

    setRows(formatted);
  } catch (error) {
    console.error("Error fetching salesman data:", error);
  }
};

export const updateSalesman = async (id, payload) => {
  try {
    const formattedPayload = {
      salesman_name: payload.name,
      salesman_phone_no: payload.phone,
      salesman_email: payload.email,
    };

    const res = await API.put(
      `/salesman/UpdateSalesman/${id}`,
      formattedPayload,
    );

    return res.data;
  } catch (error) {
    console.error("Update Salesman API error:", error);
    throw error;
  }
};

export const deleteSalesmanData = async (id) => {
  try {
    const res = await deleteSalesman(id);
    if (res.success) {
      console.log("Salesman deleted successfully");
    } else {
      console.error("Failed to delete salesman:", res.message);
    }
    return res;
  } catch (error) {
    console.error("Delete salesman API error:", error);
    throw error;
  }
};
