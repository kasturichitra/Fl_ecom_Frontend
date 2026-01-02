import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/faq";

export const getAdminFAQTree = async (params = {}) => {
  const queryString = new URLSearchParams(params)?.toString();
  return await axiosInstance.get(`${BASE_URL}/admin/tree?${queryString}`);
};


export const createFAQ = async (data) => {
  return await axiosInstance.post(`${BASE_URL}/admin`, data);
};

export const updateFAQ = async (uniqueId, data) => {
  return await axiosInstance.put(`${BASE_URL}/admin/${uniqueId}`, data);
};


export const disableFAQ = async (uniqueId) => {
  console.log(uniqueId,"uniqueId");
  return await axiosInstance.patch(`${BASE_URL}/admin/toggle/${uniqueId}`);
};

// admin/:id