// ── Table.jsx ──
import { useState } from "react";
import "./Table.css";

function Icon({ d, size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {[].concat(d).map((path, i) => (
        <path key={i} d={path} />
      ))}
    </svg>
  );
}

// Column definitions — easy to extend
const COLUMNS = [
  { key: "deviceName", label: "Device name" },
  { key: "password", label: "device password" },
  { key: "oculasAuthId", label: "oculas auth id" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

// Pass rows as a prop; defaults to empty for demo
export default function Table({ rows = [] }) {
  const [entries, setEntries] = useState(25);
  const [search, setSearch] = useState("");

  const filtered = rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const visible = filtered.slice(0, entries);

  return (
    <div className="table-card">
      {/* Export button */}
      <div className="table-card__toolbar">
        <button className="export-btn">
          <Icon d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          Export to XLS
        </button>
      </div>

      {/* Controls */}
      <div className="table-card__controls">
        {/* Show entries */}
        <div className="show-entries">
          <span className="show-entries__label">Show</span>
          <select
            className="show-entries__select"
            value={entries}
            onChange={(e) => setEntries(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="show-entries__text">entries</span>
        </div>

        {/* Search */}
        <div className="search-box">
          <span className="search-box__label">Search:</span>
          <input
            className="search-box__input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder=""
          />
        </div>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.length > 0 ? (
            visible.map((row, i) => (
              <tr key={i}>
                {COLUMNS.map((col) => (
                  <td key={col.key}>{row[col.key] ?? "—"}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={COLUMNS.length} className="data-table__empty">
                No data available in table
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="table-card__footer">
        <span className="table-card__info">
          {visible.length === 0
            ? "No entries found"
            : `Showing 1 to ${visible.length} of ${filtered.length} entries`}
        </span>
        <div className="pagination">
          <button className="page-btn" disabled>
            <Icon d="M15 19l-7-7 7-7" size={14} />
          </button>
          <button className="page-btn" disabled>
            <Icon d="M9 5l7 7-7 7" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
