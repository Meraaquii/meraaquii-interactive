const {
  getAlldevice,
  UpdateDevice: UpdateDeviceModel,
} = require("../models/deviceModel.js");

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

const UpdateDevice = async (req, res) => {
  try {
    const deviceData = req.body;

    const updated = await UpdateDeviceModel(deviceData); // ✅ now correct

    if (updated.affectedRows === 0) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json({ message: "Device updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getDevicesByClient, UpdateDevice };
