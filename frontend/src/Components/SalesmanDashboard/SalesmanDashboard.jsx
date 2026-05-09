import React, { useState, useEffect } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import {
  fetchSalesmanDetailById,
  fetchSalesmanDetail,
  fetchSalesmanOverview,
  fetchSalesmanTrends,
  fetchRecentActivities,
} from "../../services/analyticsService.js";

import "./SalesmanDashboard.css";

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="sd-bar-chart">
      {data.map((d, i) => (
        <div key={d.month} className="sd-bar-col">
          <span className="sd-bar-value">{d.count}</span>
          <div
            className={`sd-bar ${
              i === data.length - 1 ? "sd-bar--active" : "sd-bar--inactive"
            }`}
            style={{ height: `${Math.round((d.count / max) * 64)}px` }}
          />
          <span className="sd-bar-label">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="sd-progress-wrap">
      <div
        className="sd-progress-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function StatCard({ label, value, sub, accent, delay, loading }) {
  if (loading) {
    return (
      <div
        className="sd-stat sd-stat--loading"
        style={{ animationDelay: delay }}
      >
        <div className="sd-stat__skeleton"></div>
      </div>
    );
  }
  return (
    <div
      className="sd-stat"
      style={{ borderBottom: `3px solid ${accent}`, animationDelay: delay }}
    >
      <div className="sd-stat__top">
        <span className="sd-stat__label">{label}</span>
      </div>
      <div className="sd-stat__value">{value}</div>
      <div className="sd-stat__sub">{sub}</div>
    </div>
  );
}

export default function SalesmanDetailDashboard({
  salesman,
  onBack,
  showBack = false,
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("projects"); // "projects" | "customers"

  const avatarColor = salesman?.color || "#6366f1";

  useEffect(() => {
    loadDetail();
  }, [salesman?.id]);

  const loadDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;

      if (salesman?.id) {
        data = await fetchSalesmanDetailById(salesman.id);
      } else {
        const [detailData, overview, trends, activities] = await Promise.all([
          fetchSalesmanDetail(),
          fetchSalesmanOverview(),
          fetchSalesmanTrends(),
          fetchRecentActivities(5),
        ]);

        data = {
          ...overview,
          total_customers:
            overview?.total_customers || detailData?.customers?.length || 0,
          total_clients: overview?.total_clients || 0,
          total_projects:
            overview?.total_projects || detailData?.projects?.length || 0,
          target: 15,
          customers: detailData?.customers || [],
          projects: detailData?.projects || [],
          trends: trends || [],
          activities: activities || [],
          recent_deals:
            activities?.slice(0, 3).map((a) => ({
              id: a.id,
              title: a.name,
              status: "Closed",
              value: "",
              date: a.time,
            })) || [],
        };
      }

      if (!data) {
        setError("No data returned");
        return;
      }
      setDetail(data);
    } catch (err) {
      console.error("Error loading salesman detail:", err);
      setError("Failed to load salesman details");
    } finally {
      setLoading(false);
    }
  };

  const completionPct = detail?.completion_rate || 0;
  const ringDash = Math.round((completionPct / 100) * 201);

  return (
    <div className="sd-root">
      {/* ── Header with Back Button ── */}
      <div className="sd-header">
        <div className="sd-header__back-row">
          {showBack && (
            <button className="sd-back-btn" onClick={onBack}>
              <MdOutlineArrowBack />
            </button>
          )}

          <div className="sd-header__salesman-info">
            {/* <div
              className="sd-detail-avatar"
              style={{ background: `${avatarColor}20`, color: avatarColor }}
            >
              {salesman?.avatar || salesman?.name?.charAt(0).toUpperCase()}
            </div> */}
            <div>
              <h1 className="sd-header__title">
                {salesman?.name || "Dashboard"}
              </h1>
              {/* <p className="sd-header__sub">
                {salesman?.region
                  ? `${salesman.region} · ${salesman.status}`
                  : salesman?.email}
              </p> */}
            </div>
          </div>
        </div>

        {/* <button className="sd-btn" onClick={loadDetail} disabled={loading}>
          {loading ? "⟳ Loading..." : "↻ Refresh"}
        </button> */}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="sd-error-banner">
          <span className="sd-error-icon">⚠️</span>
          {error}
          <button
            className="sd-btn sd-btn--error"
            onClick={loadDetail}
            style={{ marginLeft: 12 }}
          >
            ↻ Retry
          </button>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="sd-kpi-grid">
        <StatCard
          label="Total Projects"
          value={loading ? "—" : (detail?.total_projects ?? 0)}
          sub={`${completionPct}% completion rate`}
          accent="#ec4899"
          delay="0.12s"
          loading={loading}
        />
        <StatCard
          label="Total Customers"
          value={loading ? "—" : (detail?.total_customers ?? 0)}
          sub="Total customers added"
          accent="#6366f1"
          delay="0s"
          loading={loading}
        />
        {/* <StatCard
          label="Total Clients"
          value={loading ? "—" : (detail?.total_clients ?? 0)}
          sub="Unique client companies"
          accent="#10b981"
          delay="0.06s"
          loading={loading}
        /> */}

        <StatCard
          label="Target"
          value={loading ? "—" : (detail?.target ?? 15)}
          sub="Monthly target"
          accent="#f59e0b"
          delay="0.18s"
          loading={loading}
        />
      </div>

      {/* ── Middle Row ── */}
      <div className="sd-mid-row">
        {/* Projects Trend */}
        <div
          className={`sd-card sd-anim-mid-1 ${loading ? "sd-card--loading" : ""}`}
        >
          <div className="sd-chart-header">
            <div>
              <p className="sd-section-label">Projects Trend</p>
              <p className="sd-chart-title">
                {Array.isArray(detail?.trends) && detail.trends.length > 0
                  ? `${detail.trends[detail.trends.length - 1]?.count || 0} Projects`
                  : "--"}
              </p>
            </div>
            {(detail?.growth ?? 0) >= 0 ? (
              <span className="sd-badge-up">↑ {detail?.growth ?? 0}%</span>
            ) : (
              <span className="sd-badge-down">
                ↓ {Math.abs(detail?.growth ?? 0)}%
              </span>
            )}
          </div>
          {loading ? (
            <div className="sd-chart-skeleton">Loading trends...</div>
          ) : Array.isArray(detail?.trends) && detail.trends.length > 0 ? (
            <BarChart data={detail.trends} />
          ) : (
            <div className="sd-chart-empty">No trend data available</div>
          )}
        </div>

        {/* Recent Deals */}
        <div
          className={`sd-card sd-anim-mid-2 ${loading ? "sd-card--loading" : ""}`}
        >
          <p className="sd-section-label">Recent Deals</p>
          {loading ? (
            <div className="sd-region-skeleton">Loading deals...</div>
          ) : Array.isArray(detail?.recent_deals) &&
            detail.recent_deals.length > 0 ? (
            <div className="sd-region-list">
              {detail.recent_deals.map((deal, i) => (
                <div key={deal.id || i} className="sd-region-row">
                  <div className="sd-region-meta">
                    <span className="sd-region-name">
                      {deal.title || deal.name}
                    </span>
                    <span className="sd-region-value">
                      {deal.value || ""}
                      <span
                        style={{
                          color: "#10b981",
                          fontWeight: 600,
                          marginLeft: 6,
                        }}
                      >
                        · {deal.status}
                      </span>
                    </span>
                  </div>
                  <p className="sd-activity-time">{deal.date || deal.time}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="sd-region-empty">No recent deals available</div>
          )}
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="sd-bottom-row">
        {/* Projects & Customers List with Tabs */}
        <div
          className={`sd-card sd-anim-bot-1 ${loading ? "sd-card--loading" : ""}`}
          style={{ flex: 2 }}
        >
          {/* Tabs */}
          <div
            className="sd-table-header"
            style={{ borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}
          >
            <div style={{ display: "flex", gap: 24 }}>
              <button
                className={`sd-tab ${activeTab === "projects" ? "sd-tab--active" : ""}`}
                onClick={() => setActiveTab("projects")}
                style={{
                  padding: "12px 0",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: activeTab === "projects" ? 600 : 400,
                  color: activeTab === "projects" ? "#6366f1" : "#64748b",
                  borderBottom:
                    activeTab === "projects"
                      ? "2px solid #6366f1"
                      : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                Projects ({detail?.projects?.length || 0})
              </button>
              <button
                className={`sd-tab ${activeTab === "customers" ? "sd-tab--active" : ""}`}
                onClick={() => setActiveTab("customers")}
                style={{
                  padding: "12px 0",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: activeTab === "customers" ? 600 : 400,
                  color: activeTab === "customers" ? "#6366f1" : "#64748b",
                  borderBottom:
                    activeTab === "customers"
                      ? "2px solid #6366f1"
                      : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                Customers ({detail?.customers?.length || 0})
              </button>
            </div>
          </div>

          {/* Projects Tab Content */}
          {activeTab === "projects" && (
            <>
              <div className="sd-tgrid-head">
                {["Project", "Status", "Progress", "Due Date"].map((h) => (
                  <span key={h} className="sd-tgrid-th">
                    {h}
                  </span>
                ))}
              </div>
              {loading ? (
                <div className="sd-table-skeleton">Loading projects...</div>
              ) : Array.isArray(detail?.projects) &&
                detail.projects.length > 0 ? (
                detail.projects.map((p, i) => (
                  <div key={p.id || i} className="sd-perf-row">
                    <div className="sd-perf-name-cell">
                      <div
                        className="sd-avatar"
                        style={{ background: "#6366f120", color: "#6366f1" }}
                      >
                        {(p.title || p.name || "P").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="sd-perf-name">{p.title || p.name}</p>
                        <p className="sd-perf-region">
                          {p.client || p.category || ""}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`sd-status-badge ${
                        p.status === "Active" ||
                        p.status === "A" ||
                        p.status === "Completed"
                          ? "sd-status-badge--active"
                          : "sd-status-badge--inactive"
                      }`}
                    >
                      {p.status === "A" ? "Active" : p.status}
                    </span>
                    <div>
                      <p className="sd-target-pct">{p.progress ?? 0}%</p>
                      <ProgressBar
                        value={p.progress ?? 0}
                        max={100}
                        color="#6366f1"
                      />
                    </div>
                    <p className="sd-perf-deals">
                      {p.due_date || p.dueDate || "—"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="sd-table-empty">No projects available</div>
              )}
            </>
          )}

          {/* Customers Tab Content */}
          {activeTab === "customers" && (
            <>
              <div className="sd-tgrid-head">
                {["Customer", "Contact", "Status", "Created"].map((h) => (
                  <span key={h} className="sd-tgrid-th">
                    {h}
                  </span>
                ))}
              </div>
              {loading ? (
                <div className="sd-table-skeleton">Loading customers...</div>
              ) : Array.isArray(detail?.customers) &&
                detail.customers.length > 0 ? (
                detail.customers.map((c, i) => (
                  <div key={c.id || i} className="sd-perf-row">
                    <div className="sd-perf-name-cell">
                      <div
                        className="sd-avatar"
                        style={{ background: "#10b98120", color: "#10b981" }}
                      >
                        {(c.name || "C").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="sd-perf-name">{c.name}</p>
                        <p className="sd-perf-region">{c.email || ""}</p>
                      </div>
                    </div>
                    <div>
                      <p className="sd-perf-name">{c.phone || "—"}</p>
                    </div>
                    <span
                      className={`sd-status-badge ${
                        c.status === "Active" || c.status === "A"
                          ? "sd-status-badge--active"
                          : "sd-status-badge--inactive"
                      }`}
                    >
                      {c.status === "A" ? "Active" : c.status || "Active"}
                    </span>
                    <p className="sd-perf-deals">
                      {c.created_date
                        ? new Date(c.created_date).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="sd-table-empty">No customers available</div>
              )}
            </>
          )}
        </div>

        {/* Activity + Ring */}
        <div
          className={`sd-card sd-anim-bot-2 ${loading ? "sd-card--loading" : ""}`}
        >
          <p className="sd-table-title sd-activity-heading">Recent Activity</p>
          <div className="sd-activity-list">
            {loading ? (
              <div className="sd-activity-skeleton">Loading activities...</div>
            ) : Array.isArray(detail?.activities) &&
              detail.activities.length > 0 ? (
              detail.activities.map((a, i) => (
                <div key={a.id || i} className="sd-activity-item">
                  <div className="sd-activity-body">
                    <p
                      className="sd-activity-name"
                      style={{ color: avatarColor }}
                    >
                      {a.name || salesman?.name}
                    </p>
                    <p className="sd-activity-action">{a.action}</p>
                    <p className="sd-activity-time">{a.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="sd-activity-empty">No recent activity</div>
            )}
          </div>

          {/* Target Ring */}
          <div className="sd-target-ring-wrap">
            <p className="sd-target-ring-label">Project Target</p>
            <div className="sd-ring-container">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="7"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="7"
                  strokeDasharray={`${ringDash} 201`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="sd-ring-inner">
                <span className="sd-ring-pct">{completionPct}%</span>
              </div>
            </div>
            <p className="sd-target-ring-sub">
              {detail?.total_projects || 0} projects completed
            </p>
          </div>
        </div>
      </div>

      <div className="sd-footer">
        <span className="sd-last-updated">
          {loading
            ? "Loading data..."
            : `Last updated: ${new Date().toLocaleTimeString()}`}
        </span>
      </div>
    </div>
  );
}
