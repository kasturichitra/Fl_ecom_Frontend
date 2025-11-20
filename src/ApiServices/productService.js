// src/ApiServices/productService.js
import axios from "axios";

const BASE_URL = "api/products";

// =========================== GET ALL ===========================
export const getAllProductsApi = (token, tenantId) => {
  return axios.get(`${BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-tenant-id": tenantId,
    },
  });
};

// =========================== CREATE (JSON Body) ===========================
export const createProductApi = (body, token, tenantId) => {
  return axios.post(`${BASE_URL}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-tenant-id": tenantId,
      "Content-Type": "application/json",
    },
  });
};

// =========================== UPDATE (multipart/form-data) ===========================
export const updateProductApi = (id, formData, token, tenantId) => {
  return axios.put(`${BASE_URL}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-tenant-id": tenantId,
      "Content-Type": "multipart/form-data",
    },
  });
};

// =========================== DELETE ===========================
export const deleteProductApi = (id, token, tenantId) => {
  return axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-tenant-id": tenantId,
    },
  });
};
