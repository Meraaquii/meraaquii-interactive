const {
  AddCustomer,
  updateCustomer: updateCustomerModel,
  getCustomers: getCustomersModel,
  getCustomerById: getCustomerByIdModel,
  deleteCustomer: deleteCustomerModel,
} = require("../models/customerModels.js");

const addCustomer = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const result = await AddCustomer(req.body);

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customerId: result.insertId,
    });
  } catch (error) {
    console.error("ERROR:", error.message);

    const clientErrors = [
      "Email already exists",
      "client_id is required",
      "customer_name is required",
      "customer_phone_no is required",
      "customer_email is required",
    ];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    const result = await updateCustomerModel(customerId, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const customers = await getCustomersModel(userId);

    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await getCustomerByIdModel(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    const result = await deleteCustomerModel(customerId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  addCustomer,
  updateCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
};
