import React, { useEffect, useState } from "react";
import "./ClientDashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  fetchDashboardData,
  fetchProjectDetails,
} from "../../services/ClientDashboardService";
import { IoMdArrowForward } from "react-icons/io";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
);

function ClientDashboard({ clientId }) {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [apiProjects, setApiProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("all");

  // Dummy projects data for testing the filter
  const dummyProjects = [
    {
      project_name: "Ellegenza",
      tower_count: 4,
      apartment_count: 120,
      available: 45,
      booked: 75,
      customer_count: 80,
      devices: 15,
      salesmen: 5,
    },
    {
      project_name: "Millenia",
      tower_count: 3,
      apartment_count: 90,
      available: 25,
      booked: 65,
      customer_count: 60,
      devices: 12,
      salesmen: 4,
    },
    {
      project_name: "District 25 Phase 3",
      tower_count: 5,
      apartment_count: 150,
      available: 60,
      booked: 90,
      customer_count: 95,
      devices: 20,
      salesmen: 6,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const id = clientId || 13;
        const [data, projects] = await Promise.all([
          fetchDashboardData(id),
          fetchProjectDetails(id),
        ]);
        setDashboardStats(data);
        // Store API projects
        setApiProjects(projects || []);
      } catch (error) {
        console.error("ERROR:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId]);

  // Combine API projects with dummy projects
  const allProjects = [...apiProjects, ...dummyProjects];

  if (loading) return <div>Loading Dashboard...</div>;
  if (!dashboardStats) return <div>No data found.</div>;

  // Filter projects based on selected project for table
  const filteredProjects =
    selectedProject === "all"
      ? allProjects
      : allProjects.filter((p) => p.project_name === selectedProject);

  // Calculate stats based on selected project
  const selectedProjectData =
    selectedProject === "all"
      ? null
      : allProjects.find((p) => p.project_name === selectedProject);

  const stats = selectedProjectData
    ? [
        {
          label: "Towers",
          value: selectedProjectData.tower_count,
          class: "purple",
        },
        {
          label: "Devices",
          value: selectedProjectData.devices ?? 0,
          class: "pink",
        },
        {
          label: "Customers",
          value: selectedProjectData.customer_count ?? 0,
          class: "orange",
        },
        {
          label: "Total Apartments",
          value: selectedProjectData.apartment_count,
          class: "indigo",
        },
        {
          label: "Available",
          value: selectedProjectData.available,
          class: "green",
        },
        {
          label: "Booked",
          value: selectedProjectData.booked,
          class: "red",
        },
      ]
    : [
        {
          label: "Total Projects",
          value: dashboardStats.total_projects ?? 0,
          class: "blue",
        },
        {
          label: "Total Devices",
          value: dashboardStats.total_devices ?? 0,
          class: "purple",
        },
        {
          label: "Total Salesmen",
          value: dashboardStats.total_salesman ?? 0,
          class: "pink",
        },
        {
          label: "Total Customers",
          value: dashboardStats.total_customers ?? 0,
          class: "orange",
        },
        {
          label: "Total Apartments",
          value: dashboardStats.total_apartments ?? 0,
          class: "indigo",
        },
        {
          label: "Available",
          value: dashboardStats.total_apartments_available ?? 0,
          class: "green",
        },
        {
          label: "Booked",
          value: dashboardStats.total_apartments_booked ?? 0,
          class: "red",
        },
      ];

  // Calculate apartment status data based on selection
  const apartmentStatusData = selectedProjectData
    ? {
        labels: ["Available", "Booked", "Reserved"],
        datasets: [
          {
            data: [
              selectedProjectData.available,
              selectedProjectData.booked,
              Math.max(
                0,
                selectedProjectData.apartment_count -
                  selectedProjectData.available -
                  selectedProjectData.booked,
              ),
            ],
            backgroundColor: ["#01b574", "#ee5d50", "#ffb547"],
            borderWidth: 0,
          },
        ],
      }
    : {
        labels: ["Available", "Booked", "Reserved"],
        datasets: [
          {
            data: [
              dashboardStats.total_apartments_available ?? 65,
              dashboardStats.total_apartments_booked ?? 25,
              10,
            ],
            backgroundColor: ["#01b574", "#ee5d50", "#ffb547"],
            borderWidth: 0,
          },
        ],
      };

  const monthlySalesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Apartments Sold",
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: "#4318ff",
        borderColor: "#4318ff",
        borderWidth: 1,
        barThickness: 40,
      },
      // {
      //   label: "Revenue (in Lakhs)",
      //   data: [48, 76, 60, 100, 88, 120],
      //   backgroundColor: "#b198ff",
      //   borderColor: "#b198ff",
      //   borderWidth: 1,
      // },
    ],
  };

  // Customer data - show only selected project or all projects
  const customerPerProjectData = selectedProjectData
    ? {
        labels: [selectedProjectData.project_name],
        datasets: [
          {
            label: "Customers",
            data: [selectedProjectData.customer_count ?? 0],
            backgroundColor: ["#4318ff"],
            borderRadius: 6,
            borderWidth: 0,
            barThickness: 40,
          },
        ],
      }
    : {
        labels: allProjects.map((p) => p.project_name),
        datasets: [
          {
            label: "Customers",
            data: allProjects.map((p) => p.customer_count ?? 0),
            backgroundColor: [
              "#4318ff",
              "#01b574",
              "#ffb547",
              "#ee5d50",
              "#b198ff",
            ],
            borderRadius: 6,
            borderWidth: 0,
            barThickness: 40,
          },
        ],
      };

  const salesmanLabels = dashboardStats.salesman_stats?.map((s) => s.name) ?? [
    "Rahul Sharma",
    "Priya Mehta",
    "Amit Kumar",
    "Sneha Tiwari",
    "Rohit Verma",
  ];

  const salesmanPerformanceData = {
    labels: salesmanLabels,
    datasets: [
      {
        label: "Sales Count",
        data: dashboardStats.salesman_stats?.map((s) => s.sales_count) ?? [
          18, 25, 14, 30, 21,
        ],
        backgroundColor: "#4318ff",
        borderRadius: 4,
        borderWidth: 0,
      },
      // {
      //   label: "Revenue (in Lakhs)",
      //   data: dashboardStats.salesman_stats?.map((s) => s.revenue) ?? [
      //     72, 100, 56, 120, 84,
      //   ],
      //   backgroundColor: "#b198ff",
      //   borderRadius: 4,
      //   borderWidth: 0,
      // },
      {
        label: "Apartments Booked",
        data: dashboardStats.salesman_stats?.map(
          (s) => s.apartments_booked,
        ) ?? [15, 22, 11, 27, 19],
        backgroundColor: "#01b574",
        borderRadius: 4,
        borderWidth: 0,
      },
    ],
  };

  const runtimeLabels =
    dashboardStats.salesman_runtime?.map((s) => s.name) ?? salesmanLabels;

  const appRuntimeData = {
    labels: runtimeLabels,
    datasets: [
      {
        label: "Total Login Duration (hrs)",
        data: dashboardStats.salesman_runtime?.map(
          (s) => s.total_login_hrs,
        ) ?? [42, 67, 31, 78, 55],
        borderColor: "#4318ff",
        backgroundColor: "rgba(67,24,255,0.1)",
        pointBackgroundColor: "#4318ff",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Avg Session Duration (mins)",
        data: dashboardStats.salesman_runtime?.map(
          (s) => s.avg_session_mins,
        ) ?? [38, 52, 28, 61, 44],
        borderColor: "#ffb547",
        backgroundColor: "rgba(255,181,71,0.08)",
        pointBackgroundColor: "#ffb547",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Apartment Status Distribution" },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Sales Performance" },
    },
    scales: { y: { beginAtZero: true } },
  };

  const customerChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Customers per Project" },
    },
    scales: {
      y: { beginAtZero: true },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  const salesmanChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Salesman Performance Overview" },
    },
    scales: { y: { beginAtZero: true } },
  };

  const runtimeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "App Login Duration per Salesman" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          {selectedProject === "all" ? (
            "Overview"
          ) : (
            <>
              Overview <IoMdArrowForward className="title-arrow" />{" "}
              <span className="project-name">
                {selectedProjectData?.project_name}
              </span>
            </>
          )}
        </h1>
        <div className="filter-dropdown">
          <label htmlFor="project-filter">Filter by Project:</label>
          <select
            id="project-filter"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="all">All Projects</option>
            {allProjects.map((project, index) => (
              <option key={index} value={project.project_name}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        {stats.map((item, index) => (
          <div key={index} className={`stat-card ${item.class}`}>
            <div className="stat-info">
              <span className="stat-label">{item.label}</span>
              <h2 className="stat-value">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 1: Apartment Status + Monthly Sales ── */}
      <div className="charts-section">
        <h3 className="section-subtitle">Apartment Analytics</h3>
        <div className="chart-container">
          <div className="chart-card">
            <h3 className="chart-title">Apartment Status Overview</h3>
            <div className="doughnut-chart-wrapper">
              <Doughnut data={apartmentStatusData} options={doughnutOptions} />
            </div>
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Monthly Sales Performance</h3>
            <div className="bar-chart-wrapper">
              <Bar data={monthlySalesData} options={barChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Customers per Project (full width) ── */}
      <div className="charts-section">
        <h3 className="section-subtitle">Customer Analytics</h3>
        <div className="chart-container chart-container--full">
          <div className="chart-card">
            <h3 className="chart-title">Customers per Project</h3>
            <div className="bar-chart-wrapper bar-chart-wrapper--tall">
              <Bar
                data={customerPerProjectData}
                options={customerChartOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Salesman Performance + App Login Duration ── */}
      <div className="charts-section">
        <h3 className="section-subtitle">Salesman Analytics</h3>
        <div className="chart-container">
          <div className="chart-card">
            <h3 className="chart-title">Salesman Performance</h3>
            <div className="bar-chart-wrapper">
              <Bar
                data={salesmanPerformanceData}
                options={salesmanChartOptions}
              />
            </div>
          </div>
          <div className="chart-card">
            <h3 className="chart-title">App Login Duration</h3>
            <div className="bar-chart-wrapper">
              <Line data={appRuntimeData} options={runtimeChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Projects Table ── */}
      <div className="table-section">
        <h3 className="section-subtitle">Projects Details</h3>
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Tower Count</th>
                <th>Apartment Count</th>
                <th>Available</th>
                <th>Booked</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.project_name}</td>
                    <td>{project.tower_count}</td>
                    <td>{project.apartment_count}</td>
                    <td>{project.available}</td>
                    <td>{project.booked}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No project data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;
