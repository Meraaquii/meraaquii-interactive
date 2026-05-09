// controllers/salespersonController.js

const {
  addSalesPerson,
  getAllSalesPersons,
  updateSalesPerson: updateSalesPersonModel,
  deleteSalesPerson: deleteSalesPersonModel,
} = require("../models/salespersonModel.js");

// Create Salesperson
const createSalesPerson = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const newSalesPersonId = await addSalesPerson(req.body);

    return res.status(201).json({
      status: 1,
      message: "Salesperson added successfully",
      data: {
        salespersonId: newSalesPersonId,
      },
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);

    const clientErrors = ["Email already exists", "All fields are required"];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        status: 0,
        message: error.message,
      });
    }

    return res.status(500).json({
      status: 0,
      message: "Internal Server Error",
    });
  }
};

// Get All Salespersons
const fetchAllSalesPersons = async (req, res) => {
  try {
    const salespersons = await getAllSalesPersons();

    return res.status(200).json({
      status: 1,
      message: "Salespersons fetched successfully",
      data: salespersons,
    });
  } catch (error) {
    console.error("FETCH ERROR:", error);

    return res.status(500).json({
      status: 0,
      message: "Internal Server Error",
    });
  }
};

// Update Salesperson
const updateSalesPerson = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("UPDATE ID:", id);
    console.log("UPDATE BODY:", req.body); // <-- add this

    const result = await updateSalesPersonModel(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 0,
        message: "Salesperson not found",
      });
    }

    return res.status(200).json({
      status: 1,
      message: "Salesperson updated successfully",
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error.message);
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const deleteSalesPerson = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteSalesPersonModel(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 0,
        message: "Salesperson not found",
      });
    }

    return res.status(200).json({
      status: 1,
      message: "Salesperson deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error.message);
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

module.exports = {
  createSalesPerson,
  fetchAllSalesPersons,
  updateSalesPerson,
  deleteSalesPerson,
};
