import axios from "axios";
import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/brands";

export const getAllBrandApi = (params = {}) => {
  const queryString = new URLSearchParams(params)?.toString();
  return axiosInstance.get(`${BASE_URL}${queryString ? `?${queryString}` : ""} `);
};

export const createBrandApi = (payload) => {
  return axiosInstance.post(`${BASE_URL}/`, payload);
};

export const updateBrandApi = async (uniqueId, payload) => {
  return await axiosInstance.put(`${BASE_URL}/${uniqueId}`, payload);
};

export const deleteBrandApi = async (uniqueId) => {
  return await axiosInstance.delete(`${BASE_URL}/delete/${uniqueId}`);
};
