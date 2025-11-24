import axios from "axios";
import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/brands";

export const getAllBrandApi = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.get(`${BASE_URL}${queryString ? `?${queryString}` : ""} `);
};

export const createBrandApi = (formData) => {
  return axiosInstance.post(`${BASE_URL}/`, formData,{
    headers : {
      "Content-Type" : "multipart/form-data"
    }
  });
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

export const updateBrandApi = async (uniqueId, formData) => {
  return await axiosInstance.put(`${BASE_URL}/${uniqueId}`, formData);
};

// export const deleteBrandApi = async (uniqueId, token, tenantId) => {
//   try {
//     return await axios.delete(`${BASE_URL}/delete/${uniqueId}`, {
//       headers: getHeaders(token, tenantId),
//     });
//   } catch (err) {
//     console.error("❌ Delete Brand API Error:", err.response?.data ?? err);
//     throw err;
//   }
// };

export const deleteBrandApi = async(uniqueId) =>{
  return await axiosInstance.delete(`${BASE_URL}/delete/${uniqueId}`)
}
