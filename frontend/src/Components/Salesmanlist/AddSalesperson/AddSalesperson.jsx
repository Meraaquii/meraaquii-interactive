// AddSalesperson.jsx

import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import "./AddSalesperson.css";
import { addSalesPerson } from "../../../services/salespersonService";

function AddSalesperson({
  onClose,
  clientId,
  refreshData,
  showTeamDropdown = false,
  teams = [],
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    salesperson_name: "",
    salesperson_phone: "",
    salesperson_email: "",
    team_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const loginData = JSON.parse(localStorage.getItem("user"));

      const payload = {
        ...formData,
        client_id: clientId,
        user_id: loginData?.user_id,
      };

      console.log("PAYLOAD:", payload);

      const response = await addSalesPerson(payload);

      if (response.status === 1) {
        toast.success(response.message);

        setFormData({
          salesperson_name: "",
          salesperson_phone: "",
          salesperson_email: "",
          team_name: "",
        });

        refreshData?.();
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to add salesperson",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-salesperson-overlay">
      <div className="add-salesperson-modal">
        <button className="add-salesperson-close" onClick={onClose}>
          <IoClose size={22} />
        </button>

        <div className="add-salesperson-header">
          <h1>
            <TbEdit /> Add Salesperson
          </h1>
          <p>Salesperson Information</p>
        </div>

        <form onSubmit={handleSubmit} className="add-salesperson-form">
          <div className="add-salesperson-group">
            <label>Name</label>

            <input
              type="text"
              name="salesperson_name"
              placeholder="Enter name"
              value={formData.salesperson_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-salesperson-group">
            <label>Phone</label>

            <input
              type="text"
              name="salesperson_phone"
              placeholder="Enter phone number"
              value={formData.salesperson_phone}
              onChange={handleChange}
              maxLength={10}
              required
            />
          </div>

          <div className="add-salesperson-group">
            <label>Email</label>

            <input
              type="email"
              name="salesperson_email"
              placeholder="Enter email"
              value={formData.salesperson_email}
              onChange={handleChange}
              required
            />
          </div>

          {showTeamDropdown && (
            <div className="add-salesperson-group">
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
          )}

          <div className="add-salesperson-buttons">
            <button
              type="submit"
              className="add-salesperson-submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            <button
              type="button"
              className="add-salesperson-back"
              onClick={onClose}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSalesperson;
