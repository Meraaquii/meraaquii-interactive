import apiClient from "../api/apiClient.js";

const adminService = {
  getClients: async () => {
    const res = await apiClient.get("/admin/getClients");
    return res.data.data; // { success: true, data: [...] }
  },

  getProjects: async () => {
    const res = await apiClient.get("/admin/getProjects");
    console.log("PROJECT OBJECT 👉", JSON.stringify(res.data.data[0])); // 👈 ADD THIS
    return res.data.data;
  },

  getDevices: async () => {
    const res = await apiClient.get("/admin/getDevices");
    return res.data.data;
  },
};

export default adminService;
