const {
  checkExistingBookingModel,
  createProjectFilterModel,
} = require("../models/createProjectFilterModel.js");

const { updateApartmentStatusModel } = require("../models/projectModel.js");

const createProjectFilter = async (req, res) => {
  try {
    const { team_id, salesperson_id, apartment_id, date, remarks } = req.body;

    if (!team_id || !salesperson_id || !apartment_id || !date) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    const existingBooking = await checkExistingBookingModel(apartment_id, date);

    if (existingBooking.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Apartment already booked",
      });
    }

    await createProjectFilterModel({
      team_id,
      salesperson_id,
      apartment_id,
      booking_date: date,
      remarks,
    });

    await updateApartmentStatusModel(apartment_id, "N");

    return res.status(201).json({
      success: true,
      message: "Project filter created successfully",
    });
  } catch (error) {
    console.error("Create Project Filter Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProjectFilter,
};
