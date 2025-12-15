import axiosInstance from "../axios/axiosInstance";

const BASE_URL = "/auth";

export const register = (formData) => {
    return axiosInstance.post(`${BASE_URL}/register`, formData);
};