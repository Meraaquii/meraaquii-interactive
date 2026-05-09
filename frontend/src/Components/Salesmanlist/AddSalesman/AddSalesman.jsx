import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import "./AddSalesman.css";
import { addSalesman } from "../../../services/salesmanService";

function AddSalesman({
  onClose,
  clientId,
  refreshData,
  showTeamDropdown = false,
  teams = [],
}) {
  const [formData, setFormData] = useState({
    salesman_name: "",
    salesman_phone_no: "",
    salesman_email: "",
    team_id: "",
  });

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
      const payload = {
        ...formData,
        client_id: clientId,
      };

      console.log("Submitting:", payload);

      await addSalesman(payload);

      toast.success("Salesman added successfully!");

      refreshData();
      onClose();
    } catch (error) {
      console.error("Error adding salesman:", error);

      toast.error(error?.response?.data?.message || "Failed to add salesman");
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
            <TbEdit /> Add Salesman
          </h1>

          <p>Salesman Information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Name */}
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="salesman_name"
              placeholder="Enter name"
              value={formData.salesman_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone</label>

            <input
              type="text"
              name="salesman_phone_no"
              placeholder="Enter phone number"
              value={formData.salesman_phone_no}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="salesman_email"
              placeholder="Enter email"
              value={formData.salesman_email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Team Dropdown */}
          {showTeamDropdown && (
            <div className="form-group">
              <label>Select Team</label>

              <select
                name="team_id"
                value={formData.team_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Team</option>

                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="modal-buttons">
            <button type="submit" className="btn-primary">
              Submit
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

export default AddSalesman;
