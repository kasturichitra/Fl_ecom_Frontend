import axios from "axios";
import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/brands";

export const getAllBrandApi = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}${queryString ? `?${queryString}` : ""} `);
};

export const createBrandApi = (formData) => {
  return axiosInstance.post(`${BASE_URL}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateBrandApi = async (uniqueId, formData) => {
  return await axiosInstance.put(`${BASE_URL}/${uniqueId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteBrandApi = async (uniqueId) => {
  return await axiosInstance.delete(`${BASE_URL}/delete/${uniqueId}`);
};
