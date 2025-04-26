import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:5011" + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});
console.log(process.env.BACKEND_URL);
export default axiosInstance;
