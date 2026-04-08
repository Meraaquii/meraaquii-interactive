import { fetchDevice } from "../services/deviceService.js";

export const getDeviceData = async (setRows, clientId) => {
  try {
    const data = await fetchDevice(clientId);

    console.log("API response data:", data);

    if (!Array.isArray(data)) {
      console.error("API data is not an array!", data);
      return;
    }

    setRows(data);
  } catch (error) {
    console.error("Error fetching device data:", error);
  }
};
