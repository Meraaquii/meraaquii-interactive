import { useState, useEffect } from "react";
import Table from "../Table/Table";
import "./ProjectFilter.css";
import { IoMdArrowDropdown } from "react-icons/io";
import ExportButton from "../ExportButton/ExportButton";
import projectService from "../../services/projectService";

const PROJECTFILTER_COLUMNS = [
  { key: "project_name", label: "Project Name" },
  { key: "tower_name", label: "Tower Name" },
  { key: "floor_name", label: "Floor Name" },
  { key: "apartment_name", label: "Apartment Name" },
  { key: "apartment_status", label: "Availability" },
  { key: "action", label: "Action" },
];

export default function ProjectFilter() {
  const [filters, setFilters] = useState({
    project: "",
    tower: "",
    floor: "",
    apartment: "",
  });

  const [projects, setProjects] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("User not logged in.");
          return;
        }

        const user = JSON.parse(storedUser);
        const user_email = user.user_email;
        const user_type = user.user_type;

        if (!user_email || !user_type) {
          setError("Invalid session. Please log in again.");
          return;
        }

        const data = await projectService.getProjects(user_email, user_type);
        const projectList =
          data.success && Array.isArray(data.data) ? data.data : [];

        setProjects(projectList);
        setTableRows(projectList);
      } catch (err) {
        setError(err.message || "Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // --- Derived dropdown options based on cascading selection ---

  // Unique project names
  const projectOptions = [
    ...new Set(projects.map((p) => p.project_name).filter(Boolean)),
  ];

  // Towers filtered by selected project
  const towerOptions = [
    ...new Set(
      projects
        .filter((p) => !filters.project || p.project_name === filters.project)
        .map((p) => p.tower_name)
        .filter(Boolean),
    ),
  ];

  // Floors filtered by selected project + tower
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

  // Apartments filtered by selected project + tower + floor
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

  // --- Filter table rows based on all selections ---
  useEffect(() => {
    let filtered = [...projects];

    if (filters.project) {
      filtered = filtered.filter((row) => row.project_name === filters.project);
    }
    if (filters.tower) {
      filtered = filtered.filter((row) => row.tower_name === filters.tower);
    }
    if (filters.floor) {
      filtered = filtered.filter((row) => row.floor_name === filters.floor);
    }
    if (filters.apartment) {
      filtered = filtered.filter(
        (row) => row.apartment_name === filters.apartment,
      );
    }

    setTableRows(filtered);
  }, [filters, projects]);

  // Reset downstream filters when a parent changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      const updated = { ...prev, [name]: value };

      // Clear downstream selections on parent change
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
        <ExportButton onClick={() => console.log("Export clicked!")} />
      </div>

      {error && <p className="project-filter__error">{error}</p>}

      <div className="project-filter__fields">
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
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table rows={tableRows} columns={PROJECTFILTER_COLUMNS} />
      )}
    </div>
  );
}
