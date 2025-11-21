import axios from "axios";
import axiosInstance from "../axios/axiosInstance.js";

const BASE_URL = "/category";

const getHeaders = (token, tenantId, isMultipart = false) => ({
  Authorization: `Bearer ${token ?? ""}`,
  "x-tenant-id": tenantId ?? "",
  ...(isMultipart ? { "Content-Type": "multipart/form-data" } : {}),
});

export const getAllCategoryApi = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`${BASE_URL}?${queryString}`);
  return res;
};

/**
 * -----------------------------------------
 * 🟩 CREATE CATEGORY
 * POST: /category/addCategory
 * -----------------------------------------
 */
export const createCategoryApi = async (formData, token, tenantId) => {
  const obj = Object.fromEntries(formData.entries());
  console.log(obj);
  console.log(token, tenantId);

  try {
    const data = await axios.post(`${BASE_URL}/`, formData, {
      headers: getHeaders(token, tenantId, true),
    });
    console.log(data);
  } catch (err) {
    console.error("❌ Create Category API Error:", err?.response?.data ?? err);
    throw err;
  }
};

/**
 * -----------------------------------------
 * 🟥 DELETE CATEGORY
 * DELETE: /category/deleteCategory/:id
 * -----------------------------------------
 */
export const deleteCategoryApi = async (uniqueId, token, tenantId) => {
 return await axiosInstance.delete(`${BASE_URL}/${uniqueId ?? ""}`);
};

/**
 * -----------------------------------------
 * 🟨 UPDATE CATEGORY
 * PUT: /category/updateCategory/:id
 * -----------------------------------------
 */
// http://10.1.1.156:3000/category/ME1
export const updateCategoryApi = async (uniqueId, payload) => {
  return await axiosInstance.put(`${BASE_URL}/${uniqueId ?? ""}`, payload);
};
