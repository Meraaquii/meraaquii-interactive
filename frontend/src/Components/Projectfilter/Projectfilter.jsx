import { useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import Table from "../Table/Table";
import ExportButton from "../ExportButton/ExportButton";
import projectService from "../../services/projectService";
import adminService from "../../services/Adminservice";
import "./ProjectFilter.css";

const ADMIN_COLUMNS = [
  { key: "project_name", label: "Project Name" },
  { key: "client_name", label: "Client Name" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
  { key: "action", label: "Action" },
];

const CLIENT_COLUMNS = [
  { key: "project_name", label: "Project Name" },
  { key: "tower_name", label: "Tower Name" },
  { key: "floor_name", label: "Floor Name" },
  { key: "apartment_name", label: "Apartment Name" },
  { key: "apartment_status", label: "Availability" },
  { key: "action", label: "Action" },
];

function normalizeAdminProject(p) {
  return {
    project_name: p.project_name ?? p.projectName ?? "—",
    client_name: p.client_name ?? p.clientName ?? p.client ?? "—",
    status: p.status ?? p.project_status ?? "—",
    created_at: p.created_at ?? p.createdAt ?? "—",
    action: p.action ?? "",
  };
}

export default function ProjectFilter() {
  const [filters, setFilters] = useState({
    project: "",
    tower: "",
    floor: "",
    apartment: "",
  });

  const [projects, setProjects] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userType = localStorage.getItem("user_type");
  const isAdmin = userType === "A";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        let list = [];

        if (isAdmin) {
          const raw = await adminService.getProjects();
          list = Array.isArray(raw) ? raw.map(normalizeAdminProject) : [];
        } else {
          const storedUser = localStorage.getItem("user");
          if (!storedUser) throw new Error("User not logged in.");

          const user = JSON.parse(storedUser);
          if (!user.user_email || !user.user_type)
            throw new Error("Invalid session. Please log in again.");

          const data = await projectService.getProjects(
            user.user_email,
            user.user_type,
          );
          list = data.success && Array.isArray(data.data) ? data.data : [];
        }

        setProjects(list);
        setTableRows(list);
      } catch (err) {
        setError(err.message || "Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAdmin]);

  const adminProjectOptions = [
    ...new Set(
      projects
        .map((p) => p.project_name)
        .filter((v) => v !== "—" && Boolean(v)),
    ),
  ];

  const projectOptions = [
    ...new Set(projects.map((p) => p.project_name).filter(Boolean)),
  ];
  const towerOptions = [
    ...new Set(
      projects
        .filter((p) => !filters.project || p.project_name === filters.project)
        .map((p) => p.tower_name)
        .filter(Boolean),
    ),
  ];
  const floorOptions = [
    ...new Set(
      projects
        .filter(
          (p) =>
            (!filters.project || p.project_name === filters.project) &&
            (!filters.tower || p.tower_name === filters.tower),
        )
        .map((p) => p.floor_name)
        .filter(Boolean),
    ),
  ];
  const apartmentOptions = [
    ...new Set(
      projects
        .filter(
          (p) =>
            (!filters.project || p.project_name === filters.project) &&
            (!filters.tower || p.tower_name === filters.tower) &&
            (!filters.floor || p.floor_name === filters.floor),
        )
        .map((p) => p.apartment_name)
        .filter(Boolean),
    ),
  ];

  useEffect(() => {
    let filtered = [...projects];

    if (isAdmin) {
      if (filters.project)
        filtered = filtered.filter((r) => r.project_name === filters.project);
    } else {
      if (filters.project)
        filtered = filtered.filter((r) => r.project_name === filters.project);
      if (filters.tower)
        filtered = filtered.filter((r) => r.tower_name === filters.tower);
      if (filters.floor)
        filtered = filtered.filter((r) => r.floor_name === filters.floor);
      if (filters.apartment)
        filtered = filtered.filter(
          (r) => r.apartment_name === filters.apartment,
        );
    }

    setTableRows(filtered);
  }, [filters, projects, isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "project") {
        updated.tower = "";
        updated.floor = "";
        updated.apartment = "";
      } else if (name === "tower") {
        updated.floor = "";
        updated.apartment = "";
      } else if (name === "floor") {
        updated.apartment = "";
      }
      return updated;
    });
  };

  const SelectField = ({ id, label, value, options, disabled = false }) => (
    <div className="project-filter__field">
      <label className="project-filter__label" htmlFor={id}>
        {label} <span className="required">*</span>
      </label>
      <div className="project-filter__select-wrapper">
        <select
          id={id}
          name={id}
          className="project-filter__select"
          value={value}
          onChange={handleChange}
          disabled={disabled}
        >
          <option value="">All</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="project-filter__select-arrow">
          <IoMdArrowDropdown />
        </span>
      </div>
    </div>
  );

  return (
    <div className="project-filter">
      <div className="project-list__header">
        <h2 className="project-list__title">Project Filter List</h2>
        <ExportButton
          data={tableRows}
          columns={isAdmin ? ADMIN_COLUMNS : CLIENT_COLUMNS}
          filename="projects"
        />
      </div>

      {error && <p className="project-filter__error">{error}</p>}

      <div className="project-filter__fields">
        {isAdmin ? (
          // Admin: single "Filter by Project" dropdown
          <SelectField
            id="project"
            label="Project"
            value={filters.project}
            options={adminProjectOptions}
          />
        ) : (
          <>
            <SelectField
              id="project"
              label="Project"
              value={filters.project}
              options={projectOptions}
            />
            <SelectField
              id="tower"
              label="Tower"
              value={filters.tower}
              options={filters.project ? towerOptions : []}
              disabled={!filters.project}
            />
            <SelectField
              id="floor"
              label="Floor"
              value={filters.floor}
              options={filters.tower ? floorOptions : []}
              disabled={!filters.tower}
            />
            <SelectField
              id="apartment"
              label="Apartment"
              value={filters.apartment}
              options={filters.floor ? apartmentOptions : []}
              disabled={!filters.floor}
            />
          </>
        )}
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <Table
          rows={tableRows}
          columns={isAdmin ? ADMIN_COLUMNS : CLIENT_COLUMNS}
        />
      )}
    </div>
  );
}
