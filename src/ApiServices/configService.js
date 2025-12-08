import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/configs";

// Current config is basically get all config
export const getCurrentConfig = async () => {
  return await axiosInstance.get(`${BASE_URL}/current`);
};

export const updateCurrentConfig = async (id, data) => {
  return await axiosInstance.put(`${BASE_URL}/${id}`, data);
};
