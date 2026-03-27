const {
  getAllProjects,
  getProjectById: getProjectByIdModel,
  updateApartmentStatusModel,
} = require("../models/projectModel.js");

const getProjects = async (req, res) => {
  try {
    const { user_email, user_type } = req.query;

    const projects = await getAllProjects(user_email, user_type);

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get projects",
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await getProjectByIdModel(projectId);

    if (!project || project.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
      message: "Project fetched successfully",
    });
  } catch (error) {
    console.error("Error in getProjectById:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get project",
    });
  }
};

const updateApartmentStatus = async (req, res) => {
  const { apartment_id, status } = req.body;

  if (apartment_id === undefined || status === undefined) {
    return res
      .status(400)
      .json({ message: "apartment_id and status are required" });
  }

  const result = await updateApartmentStatusModel(apartment_id, status);

  if (result.affectedRows === 0) {
    return res
      .status(404)
      .json({ message: "Apartment not found or status unchanged" });
  }

  res.json({ message: "Status updated successfully" });
};

module.exports = { getProjects, getProjectById, updateApartmentStatus };
