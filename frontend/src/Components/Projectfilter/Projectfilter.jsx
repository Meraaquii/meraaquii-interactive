import { useState } from "react";
import Table from "../Table/Table";
import "./ProjectFilter.css";
import { IoMdArrowDropdown } from "react-icons/io";
import ExportButton from "../ExportButton/ExportButton";

const PROJECTFILTER_COLUMNS = [
  { key: "projectName", label: "Project Name" },
  { key: "towerName", label: "Tower Name" },
  { key: "floorName", label: "Floor Name" },
  { key: "aprtmentName", label: "Apartment Name" },
  { key: "Availibility", label: "Availibility" },
  { key: "action", label: "Action" },
];

export default function ProjectFilter() {
  const [filters, setFilters] = useState({
    project: "",
    tower: "",
    floor: "",
    apartment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleExport = () => {
    console.log("Export clicked!");
  };

  return (
    <div className="project-filter">
      {/* Page header */}
      <div className="project-list__header">
        <h2 className="project-list__title">Project Filter List</h2>
        <ExportButton onClick={handleExport} />
      </div>

      {/* Filter Row */}
      <div className="project-filter__fields">
        <div className="project-filter__field">
          <label className="project-filter__label" htmlFor="project">
            Project <span className="required">*</span>
          </label>
          <div className="project-filter__select-wrapper">
            <select
              id="project"
              name="project"
              className="project-filter__select"
              value={filters.project}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="project1">Project 1</option>
              <option value="project2">Project 2</option>
              <option value="project3">Project 3</option>
            </select>
            <span className="project-filter__select-arrow">
              <IoMdArrowDropdown />
            </span>
          </div>
        </div>

        <div className="project-filter__field">
          <label className="project-filter__label" htmlFor="tower">
            Tower <span className="required">*</span>
          </label>
          <input
            id="tower"
            type="text"
            name="tower"
            className="project-filter__input"
            value={filters.tower}
            onChange={handleChange}
          />
        </div>

        <div className="project-filter__field">
          <label className="project-filter__label" htmlFor="floor">
            Floor <span className="required">*</span>
          </label>
          <input
            id="floor"
            type="text"
            name="floor"
            className="project-filter__input"
            value={filters.floor}
            onChange={handleChange}
          />
        </div>

        <div className="project-filter__field">
          <label className="project-filter__label" htmlFor="apartment">
            Apartment <span className="required">*</span>
          </label>
          <input
            id="apartment"
            type="text"
            name="apartment"
            className="project-filter__input"
            value={filters.apartment}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Table */}
      <Table rows={[]} columns={PROJECTFILTER_COLUMNS} />
    </div>
  );
}
