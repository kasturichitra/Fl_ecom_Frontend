import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/contactInfo";

export const getContactInfo = () => {
  return axiosInstance.get(`${BASE_URL}`);
};

export const createContactInfo = (payload) => {
  return axiosInstance.put(`${BASE_URL}/create`, payload);
};
