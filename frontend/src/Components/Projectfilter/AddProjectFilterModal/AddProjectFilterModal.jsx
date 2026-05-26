import React, { useEffect, useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { HiOutlineFilter } from "react-icons/hi";
import { toast } from "react-hot-toast";
import {
  getTeamsController,
  getSalespersonsByTeamController,
} from "../../../controllers/teamController";
import "./AddProjectFilterModal.css";

const initialFormState = { team: "", salesperson: "", date: "", remarks: "" };

function AddProjectFilterModal({ isOpen, onClose, onFinalSubmit }) {
  const [formData, setFormData] = useState(initialFormState);
  const [teams, setTeams] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setSalespersons([]);
      fetchTeams();
    }
  }, [isOpen]);

  const fetchTeams = async () => {
    try {
      const response = await getTeamsController();
      const data = response?.data || response?.teams || response || [];
      setTeams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    }
  };

  const fetchSalespersons = async (teamId) => {
    try {
      const response = await getSalespersonsByTeamController(teamId);
      const data = response?.data || response?.salespersons || response || [];
      setSalespersons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching salespersons:", error);
      setSalespersons([]);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "team") {
      setFormData((prev) => ({ ...prev, team: value, salesperson: "" }));
      if (value) await fetchSalespersons(value);
      else setSalespersons([]);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Direct single-click save handler
  const handleSaveClick = async () => {
    console.log(
      "1. SAVE CLICKED — Processing submission immediately:",
      formData,
    );

    // 1. Form Validation
    if (!formData.team || !formData.salesperson || !formData.date) {
      console.log("VALIDATION FAILED:", {
        team: formData.team,
        salesperson: formData.salesperson,
        date: formData.date,
      });
      toast.error("Please fill all required fields");
      return;
    }

    // 2. Direct Submission to Backend
    try {
      setSaving(true);
      console.log("2. VALIDATION PASSED — Firing onFinalSubmit...");

      const success = await onFinalSubmit(formData);
      console.log("3. Backend processing outcome success =", success);

      if (!success) return; // Keeps modal open if backend validation/payload failed

      handleClose(); // Resets and closes modal on clean success
    } catch (error) {
      console.error("4. SUBMISSION CRASHED:", error);
      console.error("Error response details:", error?.response?.data);
      toast.error(
        error?.response?.data?.message || "Something went wrong during save",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setSalespersons([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="add-filter-overlay">
        <div className="add-filter-modal">
          {/* HEADER */}
          <div className="add-filter-header">
            <div className="add-filter-header__icon">
              <HiOutlineFilter size={20} />
            </div>
            <h2 className="add-filter-header__title">Add Project Filter</h2>
            <button
              className="add-filter-close-btn"
              onClick={handleClose}
              disabled={saving}
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* BODY */}
          <div className="add-filter-body">
            {/* TEAM */}
            <div className="add-filter-form-group">
              <label className="add-filter-label">
                Team <span className="add-filter-required">*</span>
              </label>
              <div className="add-filter-select-wrapper">
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  className="add-filter-select"
                  disabled={saving}
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option
                      key={team.team_id || team.id}
                      value={team.team_id || team.id}
                    >
                      {team.team_name}
                    </option>
                  ))}
                </select>
                <span className="add-filter-select-arrow">
                  <IoChevronDown size={16} />
                </span>
              </div>
            </div>

            {/* SALESMAN */}
            <div className="add-filter-form-group">
              <label className="add-filter-label">
                Salesman <span className="add-filter-required">*</span>
              </label>
              <div className="add-filter-select-wrapper">
                <select
                  name="salesperson"
                  value={formData.salesperson}
                  onChange={handleChange}
                  className="add-filter-select"
                  disabled={!formData.team || saving}
                >
                  <option value="">Select Salesman</option>
                  {salespersons.map((person) => (
                    <option
                      key={person.salesperson_id || person.id}
                      value={person.salesperson_id || person.id}
                    >
                      {person.salesperson_name || person.name}
                    </option>
                  ))}
                </select>
                <span className="add-filter-select-arrow">
                  <IoChevronDown size={16} />
                </span>
              </div>
            </div>

            {/* DATE */}
            <div className="add-filter-form-group">
              <label className="add-filter-label">
                Date <span className="add-filter-required">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="add-filter-input"
                disabled={saving}
              />
            </div>

            {/* REMARKS */}
            <div className="add-filter-form-group">
              <label className="add-filter-label">Remarks</label>
              <textarea
                name="remarks"
                rows="3"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks..."
                className="add-filter-textarea"
                disabled={saving}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="add-filter-footer">
            <button
              className="add-filter-save-btn"
              onClick={handleSaveClick}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="add-filter-cancel-btn"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProjectFilterModal;
