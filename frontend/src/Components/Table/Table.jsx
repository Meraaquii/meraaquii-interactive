import { useState, useMemo } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import "./Table.css";

const DEFAULT_COLUMNS = [
  { key: "deviceName", label: "Device name" },
  { key: "password", label: "Device password" },
  { key: "oculasAuthId", label: "Oculas auth id" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

export default function Table({ rows = [], columns }) {
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const COLUMNS = columns ?? DEFAULT_COLUMNS;

  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [rows, search],
  );

  const totalEntries = filtered.length;
  const totalPages =
    entries === "All" ? 1 : Math.ceil(totalEntries / Number(entries));

  const visible =
    entries === "All"
      ? filtered
      : filtered.slice((page - 1) * entries, page * entries);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  const handleEntriesChange = (value) => {
    setEntries(value);
    setPage(1);
  };

  return (
    <div className="table-card">
      {/* Search */}
      <div className="table-card__controls">
        <div className="search-box">
          <FiSearch className="search-box__icon" />
          <input
            className="search-box__input"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
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
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="table-card__footer">
        {/* Show entries */}
        <div className="show-entries">
          <span>Show</span>
          <select
            className="show-entries__select"
            value={entries}
            onChange={(e) => handleEntriesChange(e.target.value)}
          >
            {[10, 25, 50, 100, "All"].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

        {/* Info */}
        <span className="table-card__info">
          {visible.length === 0
            ? "No entries found"
            : `Showing ${entries === "All" ? 1 : (page - 1) * entries + 1} to ${
                entries === "All"
                  ? totalEntries
                  : (page - 1) * entries + visible.length
              } of ${totalEntries} entries`}
        </span>

        {/* Pagination */}
        {entries !== "All" && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={handlePrev}
            >
              <MdChevronLeft size={20} />
            </button>

            <span className="page-info">
              {page} / {totalPages}
            </span>

            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={handleNext}
            >
              <MdChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
