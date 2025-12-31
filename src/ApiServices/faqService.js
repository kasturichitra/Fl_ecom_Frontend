import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/faq";

export const getAdminFAQTree = async (params = {}) => {
  const queryString = new URLSearchParams(params)?.toString();
  return await axiosInstance.get(`${BASE_URL}/admin/tree?${queryString}`);
};


export const createFAQ = async (data) => {
  return await axiosInstance.post(`${BASE_URL}/admin`, data);
};