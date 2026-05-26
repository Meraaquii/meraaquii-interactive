import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5500/v1/api",
  //baseURL: "https://interactive.meraaquii.com/nodeapis/v1",
  //baseURL: "http://192.168.1.152:5500/v1/api",
  //baseURL: "https://api.meraaquii.com/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

// api/apiClient.js
console.log(apiClient.defaults.baseURL);

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      console.warn("Unauthorized - token removed");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
