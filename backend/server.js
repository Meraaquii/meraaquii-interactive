const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const deviceRoutes = require("./routes/deviceRoute.js");
const projectRoutes = require("./routes/projectRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const salesmanRoutes = require("./routes/salesmanRoutes.js");
const customerRoutes = require("./routes/customerRoutes.js");
const clientDashboardRoutes = require("./routes/clientDashboardRoutes.js");
const analyticsRoutes = require("./routes/analyticsRoutes.js");
const teamRoutes = require("./routes/teamRoute.js");
const salespersonRoute = require("./routes/salespersonRoute.js");

dotenv.config();
const BASE_URL = "/v1/api";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use(`${BASE_URL}/auth`, authRoutes);
app.use(`${BASE_URL}/clients`, clientRoutes);
app.use(`${BASE_URL}/device`, deviceRoutes);
app.use(`${BASE_URL}/project`, projectRoutes);
app.use(`${BASE_URL}/admin`, adminRoutes);
app.use(`${BASE_URL}/salesman`, salesmanRoutes);
app.use(`${BASE_URL}/customer`, customerRoutes);
app.use(`${BASE_URL}/dashboard`, clientDashboardRoutes);
app.use(`${BASE_URL}/analytics`, analyticsRoutes);
app.use(`${BASE_URL}/teams`, teamRoutes);
app.use(`${BASE_URL}/salesperson`, salespersonRoute);

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
