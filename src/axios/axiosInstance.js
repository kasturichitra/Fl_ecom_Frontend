import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGFmMmFiY2VlMzUyMzQwMTJiNTZkNCIsImlhdCI6MTc2MjQwMzkxNSwiZXhwIjoxNzY0OTk1OTE1fQ.iKVJ4i83rxqEXBDjhsG2qkAfmcs2btZNyk9oj2CbJRY",
    "x-tenant-id": "tenant123",
  },
  withCredentials: true,
});
export default axiosInstance;