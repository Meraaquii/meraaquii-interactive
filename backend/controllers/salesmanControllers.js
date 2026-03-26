const {
  addSalesman,
  updateSalesman: updateSalesmanModel,
  deleteSalesman: deleteSalesmanModel,
} = require("../models/salesmanModel");

const createSalesman = async (req, res) => {
  try {
    const salesmanData = req.body;

    const newSalesmanId = await addSalesman(salesmanData);

    res.json({
      success: true,
      message: "Salesman added successfully",
      salesmanId: newSalesmanId,
    });
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add salesman",
    });
  }
};

const updateSalesman = async (req, res) => {
  try {
    const id = req.params.id;
    const salesmanData = req.body;

    const updated = await updateSalesmanModel(id, salesmanData);

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
    console.error("Update Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update salesman",
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
    console.error("Delete Error:", error); // 👈 Add this

    res.status(500).json({
      success: false,
      message: "Failed to delete salesman",
    });
  }
};

module.exports = { createSalesman, updateSalesman, deleteSalesman };
