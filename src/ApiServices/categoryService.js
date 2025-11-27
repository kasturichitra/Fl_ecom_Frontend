import axiosInstance from "../axios/axiosInstance.js";

const BASE_URL = "/category";

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
export const createCategoryApi = async (formData) => {
  return await axiosInstance.post(`${BASE_URL}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
};

export const getCategoryByUniqueIdApi = async (uniqueId) => {
  return await axiosInstance.get(`${BASE_URL}/${uniqueId ?? ""}`);
}
/**
 * -----------------------------------------
 * 🟥 DELETE CATEGORY
 * DELETE: /category/deleteCategory/:id
 * -----------------------------------------
 */
export const deleteCategoryApi = async (uniqueId) => {
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
