import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/contactInfo";

export const getContactInfo = () => {
  return axiosInstance.get(`${BASE_URL}`);
};

export const createContactInfo = (formData) => {
  return axiosInstance.put(`${BASE_URL}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
