import React, { useEffect, useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { ChevronDown } from "lucide-react";
import "./UpdateDeviceModal.css";
import adminService from "../../../services/Adminservice.js";
import { updateDevice } from "../../../services/deviceService";
import projectService from "../../../services/projectService.js";
import toast from "react-hot-toast";

const DUMMY_PROJECTS = [
  { id: "dummy-1", name: "District 25 Phase 3" },
  { id: "dummy-2", name: "Millenia" },
  { id: "dummy-3", name: "Ellegenza" },
];

function UpdateDeviceModal({ isOpen, onClose, device, onSubmit }) {
  const [formData, setFormData] = useState({
    deviceName: "",
    devicePassword: "",
    deviceOculasAuthId: "",
    deviceStatus: "",
    projectIds: [],
  });

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [initialProjectIdsLoaded, setInitialProjectIdsLoaded] = useState(false);
  const dropdownRef = useRef(null);
  const initialProjectIdsRef = useRef([]);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!isOpen || !device) return;

    const fetchProjects = async () => {
      try {
        const clientId = device.clientId ?? device.client_id;

        if (!clientId) {
          setProjects(DUMMY_PROJECTS);
          return;
        }

        const allClients = await adminService.getClients();
        const matchedClient = allClients.find(
          (c) => String(c.client_id ?? c.user_id ?? c.id) === String(clientId),
        );

        if (!matchedClient) {
          setProjects(DUMMY_PROJECTS);
          return;
        }

        const clientEmail =
          matchedClient.client_email ??
          matchedClient.user_email ??
          matchedClient.email;

        if (!clientEmail) {
          setProjects(DUMMY_PROJECTS);
          return;
        }

        const clientType =
          matchedClient.client_type ?? matchedClient.user_type ?? "C";
        const res = await projectService.getProjects(clientEmail, clientType);

        const projectArray =
          (res.data && Array.isArray(res.data) ? res.data : []) ||
          (res.projects && Array.isArray(res.projects) ? res.projects : []);

        const normalized = projectArray.map((p) => ({
          id: String(p.id ?? p.project_id),
          name: p.name ?? p.project_name,
        }));

        const realProjects = Array.from(
          new Map(normalized.map((p) => [p.id, p])).values(),
        );

        // Always merge real projects with dummy projects
        // Dummy projects are added only if not already present by name
        const realNames = new Set(realProjects.map((p) => p.name));
        const filteredDummy = DUMMY_PROJECTS.filter(
          (d) => !realNames.has(d.name),
        );

        setProjects([...realProjects, ...filteredDummy]);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects(DUMMY_PROJECTS);
      }
    };

    fetchProjects();
  }, [isOpen, device]);

  useEffect(() => {
    if (!isOpen || !device) return;

    const rawStatus = device.deviceStatus ?? device.device_status ?? "";
    const deviceStatus =
      rawStatus === "A" ? "Active" : rawStatus === "I" ? "Inactive" : rawStatus;

    let existingProjectIds = [];
    const rawProjectIds =
      device.projectIds ??
      device.project_ids ??
      device.projectId ??
      device.project_id;

    if (rawProjectIds) {
      if (Array.isArray(rawProjectIds)) {
        existingProjectIds = rawProjectIds.map(String);
      } else if (typeof rawProjectIds === "string") {
        existingProjectIds = rawProjectIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      } else {
        existingProjectIds = [String(rawProjectIds)];
      }
    }

    initialProjectIdsRef.current = existingProjectIds;

    setFormData({
      deviceName: device.deviceName ?? device.device_name ?? "",
      devicePassword: device.devicePassword ?? device.device_password ?? "",
      deviceOculasAuthId:
        device.deviceOculasAuthId ?? device.oculas_auth_id ?? "",
      deviceStatus: deviceStatus,
      projectIds: [],
    });
    setInitialProjectIdsLoaded(false);
  }, [isOpen, device]);

  useEffect(() => {
    if (!isOpen || !device) return;
    if (projects.length === 0) return;
    if (initialProjectIdsLoaded) return;

    const existingProjectIds = initialProjectIdsRef.current || [];
    const availableProjectIds = projects.map((p) => String(p.id));
    let validProjectIds = existingProjectIds.filter((id) =>
      availableProjectIds.includes(id),
    );

    // Auto-select "D25-Phase 2-Demo" / "District 25 Phase 2" by default
    // if no existing project ids are already set
    if (validProjectIds.length === 0) {
      const defaultProject = projects.find(
        (p) =>
          p.name === "D25-Phase 2-Demo" || p.name === "District 25 Phase 2",
      );
      if (defaultProject) {
        validProjectIds = [String(defaultProject.id)];
      }
    }

    setFormData((prev) => ({
      ...prev,
      projectIds: validProjectIds,
    }));
    setInitialProjectIdsLoaded(true);
  }, [isOpen, device, projects, initialProjectIdsLoaded]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectToggle = (projectId) => {
    setFormData((prev) => {
      const currentIds = prev.projectIds || [];
      const projectIdStr = String(projectId);
      if (currentIds.includes(projectIdStr)) {
        return {
          ...prev,
          projectIds: currentIds.filter((id) => id !== projectIdStr),
        };
      } else {
        return { ...prev, projectIds: [...currentIds, projectIdStr] };
      }
    });
    setShowProjectDropdown(false);
  };

  const handleRemoveProject = (projectId) => {
    setFormData((prev) => ({
      ...prev,
      projectIds: prev.projectIds.filter((id) => id !== String(projectId)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        device_id: device.deviceId ?? device.device_id,
        client_id: device.clientId ?? device.client_id,
        salesman_id: device.salesmanId ?? device.salesman_id ?? null,
        device_name: formData.deviceName,
        device_password: formData.devicePassword,
        oculas_auth_id: formData.deviceOculasAuthId,
        device_status:
          formData.deviceStatus === "Active"
            ? "A"
            : formData.deviceStatus === "Inactive"
              ? "I"
              : formData.deviceStatus,
        project_ids: formData.projectIds,
      };
      await updateDevice(payload);
      toast.success("Device updated successfully");
      onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update device");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="udm-overlay">
      <div className="udm-modal">
        <div className="udm-header">
          <h1>Edit Device</h1>
          <p>Device information</p>
          <button className="udm-close" onClick={onClose}>
            <IoClose size={18} />
          </button>
        </div>

        <form className="udm-form" onSubmit={handleSubmit}>
          <div className="udm-form-grid">
            <div className="udm-form-group">
              <label>Device Name</label>
              <input
                type="text"
                name="deviceName"
                value={formData.deviceName}
                readOnly
                className="udm-input-readonly"
              />
            </div>

            <div className="udm-form-group">
              <label>Device Password</label>
              <input
                type="text"
                name="devicePassword"
                value={formData.devicePassword}
                readOnly
                className="udm-input-readonly"
              />
            </div>

            <div className="udm-form-group">
              <label>Oculus Id</label>
              <input
                type="text"
                name="deviceOculasAuthId"
                value={formData.deviceOculasAuthId}
                readOnly
                className="udm-input-readonly"
              />
            </div>

            <div className="udm-form-group udm-form-group--full">
              <label>
                Select Projects
                {formData.projectIds.length > 0 && (
                  <span className="udm-project-count">
                    {" "}
                    ({formData.projectIds.length} selected)
                  </span>
                )}
              </label>

              {/* Selected Project Tags */}
              {formData.projectIds.length > 0 && (
                <div className="udm-project-tags">
                  {formData.projectIds.map((projectId) => {
                    const project = projects.find(
                      (p) => String(p.id) === projectId,
                    );
                    return project ? (
                      <span key={projectId} className="udm-project-tag">
                        {project.name}
                        <button
                          type="button"
                          className="udm-tag-remove"
                          onClick={() => handleRemoveProject(projectId)}
                          title="Remove project"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {/* Project Dropdown with Checkboxes */}
              <div className="udm-dropdown-container" ref={dropdownRef}>
                <button
                  type="button"
                  className={`udm-dropdown-trigger ${showProjectDropdown ? "active" : ""}`}
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                >
                  <span
                    className={`udm-dropdown-trigger-text ${formData.projectIds.length > 0 ? "has-selection" : ""}`}
                  >
                    {formData.projectIds.length === 0 ? (
                      "Select Projects"
                    ) : (
                      <span className="udm-dropdown-trigger-projects">
                        {formData.projectIds.map((id) => {
                          const project = projects.find(
                            (p) => String(p.id) === id,
                          );
                          return project ? (
                            <span
                              key={id}
                              className="udm-dropdown-trigger-project"
                            >
                              {project.name}
                            </span>
                          ) : null;
                        })}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`udm-dropdown-arrow ${showProjectDropdown ? "open" : ""}`}
                  />
                </button>

                {showProjectDropdown && (
                  <div className="udm-dropdown-menu">
                    {projects.length === 0 ? (
                      <div className="udm-dropdown-empty">
                        No projects available
                      </div>
                    ) : (
                      projects.map((proj) => {
                        const isSelected = formData.projectIds.includes(
                          String(proj.id),
                        );
                        return (
                          <div
                            key={proj.id}
                            className={`udm-dropdown-item ${isSelected ? "selected" : ""}`}
                            onClick={() => handleProjectToggle(proj.id)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span>{proj.name}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Click outside to close dropdown */}
              {showProjectDropdown && (
                <div
                  className="udm-dropdown-backdrop"
                  onClick={() => setShowProjectDropdown(false)}
                />
              )}
            </div>

            <div className="udm-form-group">
              <label>Status</label>
              <select
                name="deviceStatus"
                value={formData.deviceStatus}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="udm-buttons">
            <button type="submit" className="udm-btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="udm-btn-secondary"
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

export default UpdateDeviceModal;
