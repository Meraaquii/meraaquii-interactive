import deviceApi from "../api/apiClient.js";

export const fetchDevice = async (clientId) => {
  const res = await deviceApi.get(`/device/devices/${clientId}`);
  return res.data;
};

export const updateDevice = async (deviceData) => {
  const res = await deviceApi.put("/device/updateDevice", deviceData);
  return res.data;
};
