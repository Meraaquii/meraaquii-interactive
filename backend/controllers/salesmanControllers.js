const {
  addSalesman,
  getAllSalesman: getAllSalesmanModel,
  updateSalesman: updateSalesmanModel,
  deleteSalesman: deleteSalesmanModel,
} = require("../models/salesmanModel");

const getAllSalesman = async (req, res) => {
  try {
    const { user_email, user_type, user_id } = req.query;

    if (user_type === "S" && !user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required for salesman access",
      });
    }

    const salesmans = await getAllSalesmanModel(user_email, user_type, user_id);

    res.json({
      success: true,
      data: salesmans,
    });
  } catch (error) {
    console.error("Error in getAllSalesman:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get salesmans",
    });
  }
};

const createSalesman = async (req, res) => {
  try {
    const newSalesmanId = await addSalesman(req.body);

    res.json({
      success: true,
      message: "Salesman added successfully",
      salesmanId: newSalesmanId,
    });
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (error.message === "All fields are required") {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSalesman = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await updateSalesmanModel(id, req.body);

    if (updated) {
      res.json({
        success: true,
        message: "Salesman updated successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Salesman not found",
      });
    }
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (error.message === "All fields are required") {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSalesman = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteSalesmanModel(id);

    if (deleted) {
      res.json({
        success: true,
        message: "Salesman deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Salesman not found",
      });
    }
  } catch (error) {
    console.error("Delete Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete salesman",
    });
  }
};

module.exports = {
  getAllSalesman,
  createSalesman,
  updateSalesman,
  deleteSalesman,
};
