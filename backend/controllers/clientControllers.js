const {
  getClientUser,
  getSalesmanByClient,
  getAllSalesman,
} = require("../models/clientModel");

const getClients = async (req, res) => {
  try {
    const clients = await getClientUser();

    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const getClientSalesman = async (req, res) => {
  try {
    const { client_id } = req.body;

    const salesmans = await getSalesmanByClient(client_id);

    res.json({
      success: true,
      data: salesmans,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const getSalesman = async (req, res) => {
  try {
    const salesmans = await getAllSalesman();

    res.json({
      success: true,
      data: salesmans,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getClients, getClientSalesman, getSalesman };
