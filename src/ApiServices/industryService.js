import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/industryType";

// GET ALL
export const getAllIndustryApi = async (params = {}) => {
  try {
    // console.log("Calling API with params:", params);

    const response = await axiosInstance.get(`${BASE_URL}/search?${params}`);

    return response;
  } catch (error) {
    console.error("GET ALL INDUSTRY ERROR:", error);
    throw error; // important for thunk catch
  }
};

// CREATE
export const createIndustryApi = (formData) => {
  try {
    const obj = Object.fromEntries(formData.entries());
    // console.log(obj);
    // console.log(token, tenantId);

    return axiosInstance.post(`${BASE_URL}/`, formData);
  } catch (error) {
    console.error("CREATE INDUSTRY ERROR:", error);
    throw error;
  }
};

// DELETE
export const deleteIndustryApi = (uniqueId) => {
  try {
    return axiosInstance.delete(`${BASE_URL}/delete/${uniqueId}`);
  } catch (error) {
    console.error("DELETE INDUSTRY ERROR:", error);
    throw error;
  }
};

// UPDATE
export const updateIndustryApi = (uniqueId, formData) => {
  try {
    return axiosInstance.put(`${BASE_URL}/${uniqueId}`, formData);
  } catch (error) {
    console.error("UPDATE INDUSTRY ERROR:", error);
    throw error;
  }
};
