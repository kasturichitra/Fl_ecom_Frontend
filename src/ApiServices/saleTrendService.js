import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/saleTrends";

export const getSaleTrends = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}${queryString ? `?${queryString}` : ""}`);
};
