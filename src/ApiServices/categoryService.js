import axios from "axios";

const BASE_URL = "/api/category";


/**
 * -----------------------------------------
 * 🟦 Create Standard Headers
 * Uses: token ?? "", tenantId ?? ""
 * -----------------------------------------
 */
const getHeaders = (token, tenantId, isMultipart = false) => ({
  Authorization: `Bearer ${token ?? ""}`,
  "x-tenant-id": tenantId ?? "",
  ...(isMultipart ? { "Content-Type": "multipart/form-data" } : {}),
});

/**
 * -----------------------------------------
 * 🟦 GET ALL CATEGORIES
 * GET: /category/getAll
 * -----------------------------------------
 */
export const getAllCategoryApi = async (token, tenantId) => {
  try {
    return await axios.get(`${BASE_URL}/`, {
      headers: getHeaders(token, tenantId),
    });
  } catch (err) {
    console.error("❌ Get All Category API Error:", err?.response?.data ?? err);
    throw err;
  }
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
    const data =  await axios.post(`${BASE_URL}/`, formData, {
      headers: getHeaders(token, tenantId, true),
    });
    console.log(data)
  } catch (err) {
    console.error(
      "❌ Create Category API Error:",
      err?.response?.data ?? err
    );
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
  console.log(uniqueId, token, tenantId);

  try {
    return await axios.delete(
      `${BASE_URL}/${uniqueId ?? ""}`,
      {
        headers: getHeaders(token, tenantId),
      }
    );
  } catch (err) {
    console.error(
      "❌ Delete Category API Error:",
      err?.response?.data ?? err
    );
    throw err;
  }
};

/**
 * -----------------------------------------
 * 🟨 UPDATE CATEGORY
 * PUT: /category/updateCategory/:id
 * -----------------------------------------
 */
// http://10.1.1.156:3000/category/ME1
export const updateCategoryApi = async (
  uniqueId,
  formData,
  token,
  tenantId
) => {
  try {
    return await axios.put(
      `${BASE_URL}/${uniqueId ?? ""}`,
      formData,
      {
        headers: getHeaders(token, tenantId, true),
      }
    );
  } catch (err) {
    console.error(
      "❌ Update Category API Error:",
      err?.response?.data ?? err
    );
    throw err;
  }
};
