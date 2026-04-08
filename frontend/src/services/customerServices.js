import apiClient from "../api/apiClient";

// ✅ FETCH
export const fetchCustomers = async (userId) => {
  try {
    const res = await apiClient.get(
      `/customer/getAllCustomer?userId=${userId}`, // keep this if backend uses it
    );

    return res.data.data;
  } catch (error) {
    console.error("API ERROR:", error.response || error);
    throw error?.response?.data || { message: "Failed to fetch customers" };
  }
};

// ✅ ADD
export const addCustomer = async (customerData) => {
  try {
    const res = await apiClient.post("/customer/addCustomer", customerData);
    return res.data;
  } catch (error) {
    throw error?.response?.data || { message: "Failed to add customer" };
  }
};

// ✅ UPDATE
export const updateCustomer = async (customerId, customerData) => {
  try {
    const res = await apiClient.put(
      `/customer/updateCustomer/${customerId}`,
      customerData,
    );
    return res.data;
  } catch (error) {
    throw error?.response?.data || { message: "Failed to update customer" };
  }
};

// ✅ DELETE
export const deleteCustomer = async (customerId) => {
  try {
    const res = await apiClient.delete(
      `/customer/deleteCustomer/${customerId}`,
    );
    return res.data;
  } catch (error) {
    throw error?.response?.data || { message: "Failed to delete customer" };
  }
};

// ✅ GET BY ID
export const getCustomerById = async (customerId) => {
  try {
    const res = await apiClient.get(`/customer/getCustomer/${customerId}`);
    return res.data;
  } catch (error) {
    throw error?.response?.data || { message: "Failed to fetch customer" };
  }
};
