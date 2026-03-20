// Components/Admin/ClientList.jsx

import { useState, useMemo } from "react";
import { Edit, PlusCircle } from "lucide-react";
import "./ClientList.css";

const DUMMY_DATA = [
  {
    id: 1,
    name: "RK",
    mobile: "7992460569",
    email: "rohit.meraaquii@gmail.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Srijan Reality",
    mobile: "9999999999",
    email: "merakicreationmia@gmail.com",
    status: "Active",
  },
  {
    id: 3,
    name: "Dibyadyuti Roy",
    mobile: "9933835209",
    email: "dibyadyutiroy.cse@gmail.com",
    status: "Active",
  },
  {
    id: 4,
    name: "Nambiar Builders",
    mobile: "9062942985",
    email: "Prasanth.ak@nambiarbuilders.com",
    status: "Active",
  },
  {
    id: 5,
    name: "Acrerise",
    mobile: "7980156985",
    email: "acreriseaura@gmail.com",
    status: "Active",
  },
  {
    id: 6,
    name: "meraki_admin",
    mobile: "993383520",
    email: "souravpaul689@gmail.com",
    status: "Active",
  },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function ClientList() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      DUMMY_DATA.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase()) ||
          r.mobile.includes(search),
      ),
    [search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportXLS = () => {
    const rows = [
      ["Client name", "Client Mob No.", "Client Email", "Status"],
      ...filtered.map((r) => [r.name, r.mobile, r.email, r.status]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "client-list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="cl-wrapper">
      {/* Page header */}
      <div className="cl-header">
        <div className="cl-header__title">
          <Edit size={15} className="cl-header__icon" />
          CLIENT LIST
        </div>
      </div>

      {/* Toolbar */}
      <div className="cl-toolbar">
        <div className="cl-toolbar__left">
          <span className="cl-toolbar__show-label">Show</span>
          <select
            className="cl-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="cl-toolbar__entries-label">entries</span>
        </div>

        <div className="cl-toolbar__right">
          <button className="cl-export-btn" onClick={exportXLS}>
            Export to XLS
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </button>
          <div className="cl-search-wrap">
            <span className="cl-search-label">Search:</span>
            <input
              className="cl-search-input"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="cl-table-wrap">
        <table className="cl-table">
          <thead>
            <tr>
              <th>Client name</th>
              <th>Client Mob No.</th>
              <th>Client Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="cl-empty">
                  No records found
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.mobile}</td>
                  <td>{row.email}</td>
                  <td>
                    <span
                      className={`cl-badge cl-badge--${row.status.toLowerCase()}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <div className="cl-actions">
                      <button
                        className="cl-action-btn cl-action-btn--edit"
                        title="Edit user"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                        </svg>
                      </button>
                      <button
                        className="cl-action-btn cl-action-btn--add"
                        title="Add"
                      >
                        <PlusCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="cl-footer">
        <span className="cl-footer__info">
          Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, filtered.length)} of {filtered.length}{" "}
          entries
        </span>
        <div className="cl-pagination">
          <button
            className="cl-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            &#8249;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`cl-page-btn ${page === i + 1 ? "cl-page-btn--active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="cl-page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            &#8250;
          </button>
        </div>
      </div>
    </div>
  );
}
