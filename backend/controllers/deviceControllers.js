const { getAlldevice } = require("../models/deviceModal");

const getDevice = async (req, res) => {
  try {
    const devices = await getAlldevice();

    res.json({
      success: true,
      data: devices,
      meessage: "get device success",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDevice };
