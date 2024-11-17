import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://62.72.57.154:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default axiosInstance;
