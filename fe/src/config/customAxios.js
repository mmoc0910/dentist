import axios from "axios";
import { baseUrl } from "./baseAPI";
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("token");
  req.headers.Authorization = `Bearer ` + token;
  return req;
});
axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status === 401) {
      localStorage.clear();
      if (window.location.pathname === "/login") return;
      window.location.pathname = "/login";
    }
    return Promise.reject(err);
  }
);
export default axiosInstance;
