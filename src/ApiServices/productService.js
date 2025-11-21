import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/products";

// =========================== GET ALL ===========================
export const getAllProductsApi = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}${queryString ? `?${queryString}` : ""}`);
};

// =========================== CREATE (JSON Body) ===========================
export const createProductApi = (data) => {
  return axiosInstance.post(`${BASE_URL}`, data);
};

// =========================== UPDATE (multipart/form-data) ===========================
export const updateProductApi = (id, data) => {
  return axiosInstance.put(`${BASE_URL}/${id}`, data);
};

// =========================== DELETE ===========================
export const deleteProductApi = (id) => {
  return axiosInstance.delete(`${BASE_URL}/${id}`);
};

export const downloadProductsExcelApi = (id) => {
  return axiosInstance.get(`products/excel-template/${id}`);
};
