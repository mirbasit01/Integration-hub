import axios from "axios";
import { API_URL } from "./Environment";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data?.message || err.message);
    return Promise.reject(err);
  }
);

export default axiosClient;
