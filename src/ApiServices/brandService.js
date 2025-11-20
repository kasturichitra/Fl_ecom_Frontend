import axios from "axios";

const BASE_URL = "/api/brands";

/* --------------------------
   COMMON HEADERS
--------------------------- */
const getHeaders = (token, tenantId, isMultipart = false) => ({
  Authorization: `Bearer ${token ?? ""}`,
  "x-tenant-id": tenantId ?? "",
  ...(isMultipart ? { "Content-Type": "multipart/form-data" } : {}),
});

/* --------------------------
   GET ALL BRANDS
   GET /brand/getAll
--------------------------- */
export const getAllBrandApi = async (token, tenantId) => {
  console.log(token,tenantId)
  try {
    return await axios.get(`${BASE_URL}/`, {
      headers: getHeaders(token, tenantId),
    });
  } catch (err) {
    console.error("❌ GetAll Brand API Error:", err.response?.data ?? err);
    throw err;
  }
};

/* --------------------------
   CREATE BRAND
   POST /brand/create
--------------------------- */
export const createBrandApi = async (formData, token, tenantId) => {
  try {
    return await axios.post(`${BASE_URL}/`, formData, {
      headers: getHeaders(token, tenantId, true),
    });
  } catch (err) {
    console.error("❌ Create Brand API Error:", err.response?.data ?? err);
    throw err;
  }
};

/* --------------------------
   UPDATE BRAND
   PUT /brand/update/:id
--------------------------- */
export const updateBrandApi = async (uniqueId, formData, token, tenantId) => {
  console.log(uniqueId)
  try {
    return await axios.put(`${BASE_URL}/${uniqueId}`, formData, {
      headers: getHeaders(token, tenantId, true),
    });
  } catch (err) {
    console.error("❌ Update Brand API Error:", err.response?.data ?? err);
    throw err;
  }
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
