import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/industryType";

// GET ALL
export const getAllIndustryApi = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}/search${queryString ? `?${queryString}` : ""}`);
};

// CREATE
export const createIndustryApi = (formData) => {
  return axiosInstance.post(`${BASE_URL}/`, formData);
};

// DELETE
export const deleteIndustryApi = (uniqueId) => {
  return axiosInstance.delete(`${BASE_URL}/delete/${uniqueId}`);
};

// UPDATE
export const updateIndustryApi = (uniqueId, formData) => {
  return axiosInstance.put(`${BASE_URL}/${uniqueId}`, formData);
};
