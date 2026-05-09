import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import "./AddTeam.css";
import { addTeamController } from "../../../controllers/teamController";

function AddTeam({ onClose, refreshData }) {
  const [formData, setFormData] = useState({
    teamName: "",
  });

  const [loading, setLoading] = useState(false);

  // Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await addTeamController(formData);

      console.log("Team Added:", response);

      toast.success("Team added successfully!");

      // Refresh Team List
      if (refreshData) {
        refreshData();
      }

      // Close Modal
      onClose();
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to add team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Close */}
        <button className="modal-close" onClick={onClose}>
          <IoClose size={22} />
        </button>

        {/* Header */}
        <div className="modal-header">
          <h1>
            <TbEdit /> Add Team
          </h1>

          <p>Team Information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Team Name</label>

            <input
              type="text"
              name="teamName"
              placeholder="Enter team name"
              value={formData.teamName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Buttons */}
          <div className="modal-buttons">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>

            <button type="button" className="btn-secondary" onClick={onClose}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTeam;
