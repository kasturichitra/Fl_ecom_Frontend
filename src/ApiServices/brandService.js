import axios from "axios";
import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/brands";

export const getAllBrandApi = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}${queryString ? `?${queryString}` : ""} `);
};

export const createBrandApi = (formData) => {
  return axiosInstance.post(`${BASE_URL}/`, formData);
};

// export const createBrandApi = async (formData, token, tenantId) => {
//   try {
//     return await axios.post(`${BASE_URL}/`, formData, {
//       headers: getHeaders(token, tenantId, true),
//     });
//   } catch (err) {
//     console.error("❌ Create Brand API Error:", err.response?.data ?? err);
//     throw err;
//   }
// };

/* --------------------------
   UPDATE BRAND
   PUT /brand/update/:id
--------------------------- */
// export const updateBrandApi = async (uniqueId, formData, token, tenantId) => {
//   console.log(uniqueId)
//   try {
//     return await axios.put(`${BASE_URL}/${uniqueId}`, formData, {
//       headers: getHeaders(token, tenantId, true),
//     });
//   } catch (err) {
//     console.error("❌ Update Brand API Error:", err.response?.data ?? err);
//     throw err;
//   }
// };

export const updateBrandApi = async (uniqueId, formData) => {
  return await axiosInstance.put(`${BASE_URL}/${uniqueId}`, formData);
};

/* --------------------------
   DELETE BRAND
   DELETE /brand/delete/:id
--------------------------- */
export const deleteBrandApi = async (uniqueId, token, tenantId) => {
  try {
    return await axios.delete(`${BASE_URL}/delete/${uniqueId}`, {
      headers: getHeaders(token, tenantId),
    });
  } catch (err) {
    console.error("❌ Delete Brand API Error:", err.response?.data ?? err);
    throw err;
  }
};
