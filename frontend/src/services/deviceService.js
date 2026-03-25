import deviceApi from "../api/apiClient.js";

export const fetchDevice = async (clientId) => {
  const res = await deviceApi.get(`/device/devices/${clientId}`);
  return res.data;
};
