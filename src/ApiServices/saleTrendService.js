import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/saleTrends";

export const getSaleTrends = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}${queryString ? `?${queryString}` : ""}`);
};

export const createSaleTrend = (data) => axiosInstance.post(`${BASE_URL}`, data);

export const updateSaleTrend = (id, data) => axiosInstance.put(`${BASE_URL}/${id}`, data);

export const deleteSaleTrend = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);