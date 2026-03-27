import { fetchSalesman, deleteSalesman } from "../services/salesmanService";

export const getSalesmanData = async (setRows, clientId) => {
  try {
    const data = await fetchSalesman(clientId);

    console.log("Salesman data:", data);

    if (!Array.isArray(data)) return;

    const formatted = data.map((item) => ({
      id: item.salesman_id,
      name: item.salesman_name,
      phone: item.salesman_phone_no,
      email: item.salesman_email,
      createdAt: item.created_on,
    }));

    setRows(formatted);
  } catch (error) {
    console.error("Salesman fetch error:", error);
  }
};

export const deleteSalesmanData = async (id) => {
  return await deleteSalesman(id);
};
