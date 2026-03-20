import { fetchDevice } from "../services/deviceService";

export const getDeviceData = async (setRows) => {
  try {
    const data = await fetchDevice();
    console.log("API response data:", data); // 🔍 add this
    if (!Array.isArray(data)) {
      console.error("API data is not an array!");
      return;
    }
    const formatData = data.map((item) => ({
      deviceId: item.device_id,
      deviceName: item.device_name,
      deviceStatus: item.device_status,
      devicePassword: item.device_password,
      deviceOculasAuthId: item.oculas_auth_id,
      clientId: item.client_id,
      createdAt: item.created_on,
    }));
    setRows(formatData);
  } catch (error) {
    console.error("Error fetching device data:", error);
  }
};
