import { fetchSalesman } from "../services/salesmanService.js";

export const getSalesmanData = async (setRows, clientId) => {
  try {
    const data = await fetchSalesman(clientId);

    console.log("Salesman data:", data);

    if (!Array.isArray(data)) {
      console.error("Salesman API data is not an array!", data);
      return;
    }

    const formatted = data.map((item) => ({
      name: item.salesman_name,
      phone: item.salesman_phone_no,
      email: item.salesman_email,
      createdAt: item.created_on,
      action: "Edit",
    }));

    setRows(formatted);
  } catch (error) {
    console.error("Salesman fetch error:", error);
  }
};
