import {
  fetchCustomers,
  addCustomer,
  deleteCustomer,
  updateCustomer,
} from "../services/customerServices";

export const getCustomerData = async (setRows, userId) => {
  try {
    const data = await fetchCustomers(userId);

    if (!Array.isArray(data)) {
      console.error("Invalid customer data:", data);
      return;
    }

    const formatted = data.map((item) => ({
      id: item.cus_id,
      name: item.cus_name,
      contact_no: item.cus_phone,
      email: item.cus_email,
      address: item.cus_address,
    }));

    setRows(formatted);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
  }
};

export const addCustomerData = async (customerData) => {
  try {
    return await addCustomer(customerData);
  } catch (error) {
    throw new Error(error.message || "Failed to add customer");
  }
};

export const updateCustomerData = async (id, data) => {
  try {
    return await updateCustomer(id, data);
  } catch (error) {
    throw new Error(error.message || "Failed to update customer");
  }
};

export const deleteCustomerData = async (id) => {
  try {
    return await deleteCustomer(id);
  } catch (error) {
    throw new Error(error.message || "Failed to delete customer");
  }
};
