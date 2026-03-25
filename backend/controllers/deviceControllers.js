const { getAlldevice } = require("../models/deviceModel.js");

const getDevicesByClient = async (req, res) => {
  try {
    const client_id = req.params.client_id;

    const devices = await getAlldevice(client_id);

    res.json(devices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getDevicesByClient };
