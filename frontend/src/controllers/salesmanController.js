import { fetchSalesman } from "../services/salesmanService.js";

export const getSalesmanData = async (setRows) => {
  try {
    const data = await fetchSalesman();

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
