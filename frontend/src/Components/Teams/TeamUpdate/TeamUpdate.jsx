import React, { useState, useEffect } from "react";
import { TbEdit } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import "../AddTeam/AddTeam.css";

import { updateTeamController } from "../../../controllers/teamController";

function TeamUpdate({ team, onClose, refreshData }) {
  const [formData, setFormData] = useState({
    team_name: "",
  });

  const [loading, setLoading] = useState(false);

  // Set Existing Team Data
  useEffect(() => {
    if (team) {
      setFormData({
        team_name: team.team_name || "",
      });
    }
  }, [team]);

  // Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        team_id: team.team_id,
        team_name: formData.team_name,
      };

      const response = await updateTeamController(payload);

      console.log("Team Updated:", response);

      toast.success("Team updated successfully!");

      // Refresh Team List
      if (refreshData) {
        refreshData();
      }

      // Close Modal
      onClose();
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to update team");
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
            <TbEdit /> Update Team
          </h1>

          <p>Update Team Information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Team Name</label>

            <input
              type="text"
              name="team_name"
              placeholder="Enter team name"
              value={formData.team_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Buttons */}
          <div className="modal-buttons">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update"}
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

export default TeamUpdate;
