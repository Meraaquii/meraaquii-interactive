import React, { useState, useEffect } from "react";
import { TbEdit } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";

import "./UpdateSalesmanList.css";

import { updateSalesPersonData } from "../../../controllers/salespersonController";
import { getTeamsService } from "../../../services/teamService";

function UpdateSalesmanList({ onClose, salesperson, refreshData }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    team_name: "",
  });

  const [teams, setTeams] = useState([]);

  // Load teams
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await getTeamsService();
        console.log("Teams Response:", response);
        setTeams(response.data || []);
      } catch (error) {
        console.error("Error fetching teams:", error);
        toast.error("Failed to load teams");
      }
    };

    loadTeams();
  }, []);

  // Prefill data
  useEffect(() => {
    if (!salesperson) return;

    console.log("Salesperson prop received:", salesperson);

    setFormData({
      name: salesperson.name || "",
      phone: salesperson.phone || "",
      email: salesperson.email || "",
      team_name: salesperson.team_name || "",
    });
  }, [salesperson]);

  if (!salesperson) return null;

  // Handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const id = salesperson.id;

      console.log("Submitting ID:", id);
      console.log("Payload:", formData);

      if (!id) {
        toast.error("Salesperson ID not found");
        return;
      }

      await updateSalesPersonData(id, formData);

      toast.success("Salesperson updated successfully!");

      refreshData();
      onClose();
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error?.message || "Failed to update salesperson");
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
            <TbEdit /> Update Salesperson
          </h1>
          <p>Edit Salesperson Information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Team */}
          <div className="form-group">
            <label>Select Team</label>
            <select
              name="team_name"
              value={formData.team_name}
              onChange={handleChange}
              required
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.team_name}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="modal-buttons">
            <button type="submit" className="btn-primary">
              Update
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateSalesmanList;
