import deviceApi from "../api/apiClient.js";

export const fetchDevice = async () => {
  const res = await deviceApi.get("/device/getDevices");
  return res.data.data;
};
