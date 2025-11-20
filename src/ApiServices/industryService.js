import axios from "axios";

const BASE_URL = "api/industryType";

// GET ALL
export const getAllIndustryApi = async (token, tenantId, params) => {
  try {
    // console.log("Calling API with params:", params);

    const response = await axios.get(`${BASE_URL}/search`, {
      params: params || {}, // ensure it is always an object
      headers: {
        Authorization: `Bearer ${token}`,
        "x-tenant-id": tenantId,
      },
    });

    return response;
  } catch (error) {
    console.error("GET ALL INDUSTRY ERROR:", error);
    throw error; // important for thunk catch
  }
};

// CREATE
export const createIndustryApi = (formData, token, tenantId) => {
  try {
    const obj = Object.fromEntries(formData.entries());
    // console.log(obj);
    // console.log(token, tenantId);

    return axios.post(`${BASE_URL}/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-tenant-id": tenantId,
      },
    });
  } catch (error) {
    console.error("CREATE INDUSTRY ERROR:", error);
    throw error;
  }
};

// DELETE
export const deleteIndustryApi = (uniqueId, token, tenantId) => {
  try {
    return axios.delete(`${BASE_URL}/delete/${uniqueId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-tenant-id": tenantId,
      },
    });
  } catch (error) {
    console.error("DELETE INDUSTRY ERROR:", error);
    throw error;
  }
};

// UPDATE
export const updateIndustryApi = (uniqueId, formData, token, tenantId) => {
  try {
    return axios.put(`${BASE_URL}/${uniqueId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-tenant-id": tenantId,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("UPDATE INDUSTRY ERROR:", error);
    throw error;
  }
};
