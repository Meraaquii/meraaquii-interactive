const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const deviceRoutes = require("./routes/deviceRoute.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/clients", clientRoutes);
app.use("/v1/api/device", deviceRoutes);

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
